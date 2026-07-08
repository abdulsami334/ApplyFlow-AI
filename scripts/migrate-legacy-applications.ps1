param(
    [string]$LegacyFile = "D:\Asp.Net\Apply flow Legacy\applications.txt",
    [string]$BackendUrl = "http://localhost:5267",
    [string]$Database = "ApplyFlowDB",
    [string]$DbUser = "postgres",
    [string]$DbPassword = "sami12",
    [string]$DefaultPassword = "password123"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $LegacyFile)) {
    throw "Legacy file not found: $LegacyFile"
}

$psql = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
if (-not (Test-Path -LiteralPath $psql)) {
    $psql = "psql"
}

function Normalize-Status([string]$status) {
    if ([string]::IsNullOrWhiteSpace($status)) { return "Applied" }

    switch ($status.Trim().ToLowerInvariant()) {
        "applied" { return "Applied" }
        "screening" { return "Screening" }
        "interview" { return "Interview" }
        "offer" { return "Offer" }
        "rejected" { return "Rejected" }
        default { return (Get-Culture).TextInfo.ToTitleCase($status.Trim().ToLowerInvariant()) }
    }
}

function Convert-LegacyDate([string]$value) {
    $parsed = [datetime]::MinValue
    if ([datetime]::TryParse($value, [ref]$parsed)) {
        return $parsed.ToString("yyyy-MM-dd")
    }

    return (Get-Date).ToString("yyyy-MM-dd")
}

function Sql-Escape([string]$value) {
    if ($null -eq $value) { return "" }
    return $value.Replace("'", "''")
}

function Ensure-User([string]$email) {
    $body = @{
        email = $email
        password = $DefaultPassword
    } | ConvertTo-Json

    try {
        Invoke-RestMethod -Uri "$BackendUrl/api/auth/register" -Method Post -ContentType "application/json" -Body $body | Out-Null
    }
    catch {
        $response = $_.Exception.Response
        if ($null -eq $response -or [int]$response.StatusCode -ne 400) {
            throw
        }
    }
}

$env:PGPASSWORD = $DbPassword
$rows = Get-Content -LiteralPath $LegacyFile | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
$inserted = 0

foreach ($row in $rows) {
    $fields = $row.Split("|")

    if ($fields.Count -ne 6) {
        throw "Invalid row format. Use: email|company|position|date|status|notes. Bad row: $row"
    }

    $email = $fields[0].Trim().ToLowerInvariant()
    $company = Sql-Escape $fields[1].Trim()
    $position = Sql-Escape $fields[2].Trim()
    $date = Convert-LegacyDate $fields[3].Trim()
    $status = Sql-Escape (Normalize-Status $fields[4])
    $notes = Sql-Escape $fields[5].Trim()

    Ensure-User $email

    $sql = @"
WITH selected_user AS (
    SELECT "Id" FROM "Users" WHERE "Email" = '$email' LIMIT 1
)
INSERT INTO "Applications"
("Id", "UserId", "CompanyName", "PositionTitle", "ApplicationDate", "Status", "Notes", "CreatedAt")
SELECT gen_random_uuid(), "Id", '$company', '$position', '$date'::timestamp with time zone, '$status', '$notes', NOW()
FROM selected_user;
"@

    $tempSql = Join-Path $env:TEMP "applyflow-legacy-migration-$([guid]::NewGuid()).sql"
    Set-Content -LiteralPath $tempSql -Value $sql -Encoding UTF8

    try {
        & $psql -h localhost -p 5432 -U $DbUser -d $Database -f $tempSql | Out-Null
    }
    finally {
        Remove-Item -LiteralPath $tempSql -Force -ErrorAction SilentlyContinue
    }

    $inserted++
}

Write-Host "Migrated $inserted legacy applications."
