using ApplyFlow_Backend.Data;
using ApplyFlow_Backend.DTOs.Applications;
using ApplyFlow_Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace ApplyFlow_Backend.Services;

public class ApplicationService : IApplicationService
{
    public static readonly string[] ValidStatuses =
    [
        "Applied",
        "Screening",
        "Interview",
        "Offer",
        "Rejected",
        "Withdrawn"
    ];

    private readonly AppDbContext _context;

    public ApplicationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ApplicationResponseDto> CreateAsync(Guid userId, CreateApplicationRequestDto request)
    {
        var status = NormalizeStatus(request.Status);
        var application = new Application
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            CompanyName = request.CompanyName.Trim(),
            PositionTitle = request.PositionTitle.Trim(),
            ApplicationDate = request.ApplicationDate,
            Status = status,
            Location = NormalizeOptionalText(request.Location),
            JobType = NormalizeOptionalText(request.JobType),
            WorkMode = NormalizeOptionalText(request.WorkMode),
            Source = NormalizeOptionalText(request.Source),
            SalaryRange = NormalizeOptionalText(request.SalaryRange),
            ContactName = NormalizeOptionalText(request.ContactName),
            ContactEmail = NormalizeOptionalText(request.ContactEmail)?.ToLowerInvariant(),
            JobUrl = NormalizeOptionalText(request.JobUrl),
            FollowUpDate = request.FollowUpDate,
            Notes = NormalizeNotes(request.Notes),
            CreatedAt = DateTime.UtcNow
        };

        _context.Applications.Add(application);
        await _context.SaveChangesAsync();

        return ToResponse(application);
    }

    public async Task<IReadOnlyList<ApplicationResponseDto>> GetAllAsync(Guid userId)
    {
        return await _context.Applications
            .AsNoTracking()
            .Where(application => application.UserId == userId)
            .OrderByDescending(application => application.ApplicationDate)
            .ThenByDescending(application => application.CreatedAt)
            .Select(application => ToResponse(application))
            .ToListAsync();
    }

    public async Task<ApplicationResponseDto?> GetByIdAsync(Guid userId, Guid applicationId)
    {
        var application = await _context.Applications
            .AsNoTracking()
            .FirstOrDefaultAsync(application => application.Id == applicationId && application.UserId == userId);

        return application is null ? null : ToResponse(application);
    }

    public async Task<ApplicationResponseDto?> UpdateAsync(Guid userId, Guid applicationId, UpdateApplicationRequestDto request)
    {
        var application = await _context.Applications
            .FirstOrDefaultAsync(application => application.Id == applicationId && application.UserId == userId);

        if (application is null)
        {
            return null;
        }

        application.CompanyName = request.CompanyName.Trim();
        application.PositionTitle = request.PositionTitle.Trim();
        application.ApplicationDate = request.ApplicationDate;
        application.Status = NormalizeStatus(request.Status);
        application.Location = NormalizeOptionalText(request.Location);
        application.JobType = NormalizeOptionalText(request.JobType);
        application.WorkMode = NormalizeOptionalText(request.WorkMode);
        application.Source = NormalizeOptionalText(request.Source);
        application.SalaryRange = NormalizeOptionalText(request.SalaryRange);
        application.ContactName = NormalizeOptionalText(request.ContactName);
        application.ContactEmail = NormalizeOptionalText(request.ContactEmail)?.ToLowerInvariant();
        application.JobUrl = NormalizeOptionalText(request.JobUrl);
        application.FollowUpDate = request.FollowUpDate;
        application.Notes = NormalizeNotes(request.Notes);

        await _context.SaveChangesAsync();

        return ToResponse(application);
    }

    public async Task<bool> DeleteAsync(Guid userId, Guid applicationId)
    {
        var application = await _context.Applications
            .FirstOrDefaultAsync(application => application.Id == applicationId && application.UserId == userId);

        if (application is null)
        {
            return false;
        }

        _context.Applications.Remove(application);
        await _context.SaveChangesAsync();

        return true;
    }

    private static string NormalizeStatus(string status)
    {
        var normalized = ValidStatuses.FirstOrDefault(validStatus =>
            string.Equals(validStatus, status.Trim(), StringComparison.OrdinalIgnoreCase));

        if (normalized is null)
        {
            throw new ArgumentException($"Status must be one of: {string.Join(", ", ValidStatuses)}.");
        }

        return normalized;
    }

    private static string? NormalizeNotes(string? notes)
    {
        return string.IsNullOrWhiteSpace(notes) ? null : notes.Trim();
    }

    private static string? NormalizeOptionalText(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }

    private static ApplicationResponseDto ToResponse(Application application)
    {
        return new ApplicationResponseDto
        {
            Id = application.Id,
            UserId = application.UserId,
            CompanyName = application.CompanyName,
            PositionTitle = application.PositionTitle,
            ApplicationDate = application.ApplicationDate,
            Status = application.Status,
            Location = application.Location,
            JobType = application.JobType,
            WorkMode = application.WorkMode,
            Source = application.Source,
            SalaryRange = application.SalaryRange,
            ContactName = application.ContactName,
            ContactEmail = application.ContactEmail,
            JobUrl = application.JobUrl,
            FollowUpDate = application.FollowUpDate,
            Notes = application.Notes,
            CreatedAt = application.CreatedAt
        };
    }
}
