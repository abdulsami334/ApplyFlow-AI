# ApplyFlow MVP - .NET Backend Starter Project

**Project Type:** ASP.NET Core 8 REST API
**Database:** PostgreSQL (from schema already created)
**Architecture:** Clean Architecture with Repository Pattern
**Status:** Ready to Build 🚀

---

## 📋 PROJECT SETUP INSTRUCTIONS (Do This First)

### Prerequisites
```bash
# Install .NET 8 SDK
https://dotnet.microsoft.com/en-us/download/dotnet/8.0

# Install PostgreSQL (if not already done)
https://www.postgresql.org/download/

# Verify installations
dotnet --version          # Should be 8.0+
psql --version            # Should be PostgreSQL 15+
```

### Step 1: Create Solution Structure
```bash
# Create solution folder
mkdir ApplyFlow
cd ApplyFlow

# Create solution file
dotnet new sln -n ApplyFlow

# Create projects
dotnet new webapi -n ApplyFlow.Api
dotnet new classlib -n ApplyFlow.Domain
dotnet new classlib -n ApplyFlow.Application
dotnet new classlib -n ApplyFlow.Infrastructure
dotnet new xunit -n ApplyFlow.Tests

# Add all projects to solution
dotnet sln add ApplyFlow.Api/ApplyFlow.Api.csproj
dotnet sln add ApplyFlow.Domain/ApplyFlow.Domain.csproj
dotnet sln add ApplyFlow.Application/ApplyFlow.Application.csproj
dotnet sln add ApplyFlow.Infrastructure/ApplyFlow.Infrastructure.csproj
dotnet sln add ApplyFlow.Tests/ApplyFlow.Tests.csproj

# Set up project references
cd ApplyFlow.Api
dotnet add reference ../ApplyFlow.Application/ApplyFlow.Application.csproj ../ApplyFlow.Infrastructure/ApplyFlow.Infrastructure.csproj
cd ../ApplyFlow.Application
dotnet add reference ../ApplyFlow.Domain/ApplyFlow.Domain.csproj
cd ../ApplyFlow.Infrastructure
dotnet add reference ../ApplyFlow.Domain/ApplyFlow.Domain.csproj ../ApplyFlow.Application/ApplyFlow.Application.csproj
cd ../ApplyFlow.Tests
dotnet add reference ../ApplyFlow.Application/ApplyFlow.Application.csproj ../ApplyFlow.Infrastructure/ApplyFlow.Infrastructure.csproj
cd ..
```

### Step 2: Add NuGet Packages

**ApplyFlow.Api:**
```bash
cd ApplyFlow.Api

# Core
dotnet add package Microsoft.AspNetCore.OpenApi
dotnet add package Swashbuckle.AspNetCore

# Database
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.EntityFrameworkCore.Tools

# Authentication
dotnet add package System.IdentityModel.Tokens.Jwt
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer

# Security & Password
dotnet add package BCrypt.Net-Next

# Validation
dotnet add package FluentValidation
dotnet add package FluentValidation.DependencyInjectionExtensions

# Logging
dotnet add package Serilog
dotnet add package Serilog.AspNetCore

# AutoMapper
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection

cd ..
```

**ApplyFlow.Application:**
```bash
cd ApplyFlow.Application
dotnet add package FluentValidation
dotnet add package AutoMapper
cd ..
```

**ApplyFlow.Infrastructure:**
```bash
cd ApplyFlow.Infrastructure
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package BCrypt.Net-Next
cd ..
```

**ApplyFlow.Tests:**
```bash
cd ApplyFlow.Tests
dotnet add package Moq
dotnet add package FluentAssertions
cd ..
```

### Step 3: Database Setup

```bash
# Create PostgreSQL database
createdb applyflow_mvp

# Run your schema SQL file (from previous setup)
psql applyflow_mvp < schema.sql

# Verify tables created
psql applyflow_mvp -c "\dt"
```

### Step 4: Update appsettings.json

**ApplyFlow.Api/appsettings.json:**
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=applyflow_mvp;Username=postgres;Password=your_password"
  },
  "JwtSettings": {
    "Secret": "your-super-secret-key-min-32-characters-long!!!",
    "ExpirationMinutes": 15,
    "RefreshTokenExpirationDays": 7
  },
  "AllowedHosts": "*"
}
```

---

## 🏗️ PROJECT STRUCTURE

```
ApplyFlow/
├── ApplyFlow.Api/                      # Entry Point (ASP.NET Core)
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── ApplicationController.cs
│   │   ├── UserController.cs
│   │   └── StatisticsController.cs
│   ├── Middleware/
│   │   ├── ExceptionHandlingMiddleware.cs
│   │   └── JwtMiddleware.cs
│   ├── Extensions/
│   │   └── ServiceCollectionExtensions.cs
│   ├── Program.cs
│   ├── appsettings.json
│   └── appsettings.Development.json
│
├── ApplyFlow.Domain/                   # Business Entities
│   ├── Entities/
│   │   ├── User.cs
│   │   ├── Application.cs
│   │   └── ApplicationStatus.cs
│   ├── Interfaces/
│   │   ├── IRepository.cs
│   │   ├── IUnitOfWork.cs
│   │   └── IEntity.cs
│   └── Exceptions/
│       ├── NotFoundException.cs
│       └── ValidationException.cs
│
├── ApplyFlow.Application/              # Business Logic & DTOs
│   ├── Services/
│   │   ├── IAuthenticationService.cs
│   │   ├── AuthenticationService.cs
│   │   ├── IApplicationService.cs
│   │   ├── ApplicationService.cs
│   │   ├── IUserService.cs
│   │   └── UserService.cs
│   ├── DTOs/
│   │   ├── Auth/
│   │   │   ├── LoginRequestDto.cs
│   │   │   ├── RegisterRequestDto.cs
│   │   │   └── AuthResponseDto.cs
│   │   ├── Applications/
│   │   │   ├── CreateApplicationDto.cs
│   │   │   ├── UpdateApplicationDto.cs
│   │   │   └── ApplicationResponseDto.cs
│   │   └── Users/
│   │       └── UserResponseDto.cs
│   ├── Validators/
│   │   ├── RegisterValidator.cs
│   │   ├── LoginValidator.cs
│   │   └── CreateApplicationValidator.cs
│   ├── Mappers/
│   │   ├── MappingProfile.cs
│   │   └── ApplicationProfile.cs
│   └── ServiceCollectionExtensions.cs
│
├── ApplyFlow.Infrastructure/           # Data Access & External Services
│   ├── Data/
│   │   ├── ApplicationDbContext.cs
│   │   ├── EntityConfigurations/
│   │   │   ├── UserConfiguration.cs
│   │   │   └── ApplicationConfiguration.cs
│   │   └── SeedData.cs
│   ├── Repositories/
│   │   ├── Repository.cs (Generic)
│   │   ├── ApplicationRepository.cs
│   │   ├── UserRepository.cs
│   │   └── UnitOfWork.cs
│   ├── Services/
│   │   ├── PasswordHashingService.cs
│   │   ├── JwtTokenService.cs
│   │   └── DateTimeService.cs
│   └── ServiceCollectionExtensions.cs
│
├── ApplyFlow.Tests/                    # Unit & Integration Tests
│   ├── Unit/
│   │   ├── ApplicationServiceTests.cs
│   │   ├── AuthenticationServiceTests.cs
│   │   └── PasswordHashingServiceTests.cs
│   ├── Integration/
│   │   ├── AuthControllerTests.cs
│   │   └── ApplicationControllerTests.cs
│   └── Fixtures/
│       ├── DatabaseFixture.cs
│       └── TestData.cs
│
└── README.md
```

---

## 🔧 CORE IMPLEMENTATION (Copy-Paste Ready)

### 1. Domain Entities

**ApplyFlow.Domain/Entities/User.cs:**
```csharp
namespace ApplyFlow.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public bool IsActive { get; set; } = true;
    public bool EmailVerified { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedAt { get; set; }

    public ICollection<Application> Applications { get; set; } = new List<Application>();
}
```

**ApplyFlow.Domain/Entities/ApplicationStatus.cs:**
```csharp
namespace ApplyFlow.Domain.Entities;

public class ApplicationStatus
{
    public short Id { get; set; }
    public string Name { get; set; } = null!;
    public string DisplayName { get; set; } = null!;
    public string? Description { get; set; }

    public ICollection<Application> Applications { get; set; } = new List<Application>();
}
```

**ApplyFlow.Domain/Entities/Application.cs:**
```csharp
namespace ApplyFlow.Domain.Entities;

public class Application
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string CompanyName { get; set; } = null!;
    public string PositionTitle { get; set; } = null!;
    public string? JobUrl { get; set; }
    public string? Location { get; set; }
    public DateTime ApplicationDate { get; set; }
    public short StatusId { get; set; } = 1; // APPLIED
    public string? RecruiterName { get; set; }
    public string? RecruiterEmail { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public ApplicationStatus Status { get; set; } = null!;
}
```

### 2. DbContext

**ApplyFlow.Infrastructure/Data/ApplicationDbContext.cs:**
```csharp
using ApplyFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplyFlow.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Application> Applications => Set<Application>();
    public DbSet<ApplicationStatus> ApplicationStatuses => Set<ApplicationStatus>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(500);
            entity.Property(e => e.FirstName).HasMaxLength(100);
            entity.Property(e => e.LastName).HasMaxLength(100);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.IsActive);
        });

        // ApplicationStatus configuration
        modelBuilder.Entity<ApplicationStatus>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
            entity.Property(e => e.DisplayName).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.Name).IsUnique();

            // Seed status data
            entity.HasData(
                new ApplicationStatus { Id = 1, Name = "APPLIED", DisplayName = "Applied", Description = "Initial application submitted" },
                new ApplicationStatus { Id = 2, Name = "SCREENING", DisplayName = "Screening", Description = "Application under initial review" },
                new ApplicationStatus { Id = 3, Name = "INTERVIEW", DisplayName = "Interview", Description = "Interview scheduled or in progress" },
                new ApplicationStatus { Id = 4, Name = "OFFER", DisplayName = "Offer", Description = "Job offer received" },
                new ApplicationStatus { Id = 5, Name = "REJECTED", DisplayName = "Rejected", Description = "Application rejected" },
                new ApplicationStatus { Id = 6, Name = "WITHDRAWN", DisplayName = "Withdrawn", Description = "Application withdrawn by user" }
            );
        });

        // Application configuration
        modelBuilder.Entity<Application>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CompanyName).IsRequired().HasMaxLength(255);
            entity.Property(e => e.PositionTitle).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Location).HasMaxLength(255);
            entity.Property(e => e.RecruiterName).HasMaxLength(255);
            entity.Property(e => e.RecruiterEmail).HasMaxLength(255);

            // Foreign keys
            entity.HasOne(e => e.User)
                .WithMany(u => u.Applications)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Status)
                .WithMany(s => s.Applications)
                .HasForeignKey(e => e.StatusId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.StatusId);
            entity.HasIndex(e => new { e.UserId, e.StatusId });
            entity.HasIndex(e => e.CompanyName);
            entity.HasIndex(e => e.ApplicationDate);
        });
    }
}
```

### 3. Repositories

**ApplyFlow.Infrastructure/Repositories/Repository.cs (Generic):**
```csharp
using ApplyFlow.Domain.Entities;
using ApplyFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ApplyFlow.Infrastructure.Repositories;

public class Repository<T> where T : class
{
    protected readonly ApplicationDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(ApplicationDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(Guid id)
    {
        return await _dbSet.FindAsync(id);
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public async Task AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
    }

    public void Update(T entity)
    {
        _dbSet.Update(entity);
    }

    public void Delete(T entity)
    {
        _dbSet.Remove(entity);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
```

**ApplyFlow.Infrastructure/Repositories/UserRepository.cs:**
```csharp
using ApplyFlow.Domain.Entities;
using ApplyFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ApplyFlow.Infrastructure.Repositories;

public class UserRepository : Repository<User>
{
    public UserRepository(ApplicationDbContext context) : base(context) { }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Email == email && u.DeletedAt == null);
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _dbSet.AnyAsync(u => u.Email == email && u.DeletedAt == null);
    }
}
```

**ApplyFlow.Infrastructure/Repositories/ApplicationRepository.cs:**
```csharp
using ApplyFlow.Domain.Entities;
using ApplyFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ApplyFlow.Infrastructure.Repositories;

public class ApplicationRepository : Repository<Application>
{
    public ApplicationRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IEnumerable<Application>> GetUserApplicationsAsync(Guid userId)
    {
        return await _dbSet
            .Where(a => a.UserId == userId && a.DeletedAt == null)
            .Include(a => a.Status)
            .OrderByDescending(a => a.ApplicationDate)
            .ToListAsync();
    }

    public async Task<(IEnumerable<Application> Items, int Total)> GetUserApplicationsPagedAsync(
        Guid userId, int page = 1, int pageSize = 20, short? statusId = null, string? search = null)
    {
        var query = _dbSet
            .Where(a => a.UserId == userId && a.DeletedAt == null)
            .Include(a => a.Status);

        if (statusId.HasValue)
            query = query.Where(a => a.StatusId == statusId);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(a => 
                EF.Functions.ILike(a.CompanyName, $"%{search}%") ||
                EF.Functions.ILike(a.PositionTitle, $"%{search}%"));

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(a => a.ApplicationDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, total);
    }

    public async Task<Application?> GetUserApplicationAsync(Guid applicationId, Guid userId)
    {
        return await _dbSet
            .Include(a => a.Status)
            .FirstOrDefaultAsync(a => a.Id == applicationId && a.UserId == userId && a.DeletedAt == null);
    }

    public async Task<Dictionary<short, int>> GetApplicationCountByStatusAsync(Guid userId)
    {
        return await _dbSet
            .Where(a => a.UserId == userId && a.DeletedAt == null)
            .GroupBy(a => a.StatusId)
            .ToDictionaryAsync(g => g.Key, g => g.Count());
    }
}
```

### 4. Authentication Service

**ApplyFlow.Infrastructure/Services/JwtTokenService.cs:**
```csharp
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace ApplyFlow.Infrastructure.Services;

public interface IJwtTokenService
{
    string GenerateAccessToken(Guid userId, string email);
    string GenerateRefreshToken();
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
}

public class JwtTokenService : IJwtTokenService
{
    private readonly string _secret;
    private readonly int _expirationMinutes;

    public JwtTokenService(IConfiguration configuration)
    {
        _secret = configuration["JwtSettings:Secret"] ?? throw new ArgumentNullException("JWT Secret not configured");
        _expirationMinutes = int.Parse(configuration["JwtSettings:ExpirationMinutes"] ?? "15");
    }

    public string GenerateAccessToken(Guid userId, string email)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_secret);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim("sub", userId.ToString()),
                new Claim("email", email)
            }),
            Expires = DateTime.UtcNow.AddMinutes(_expirationMinutes),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }

    public ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_secret)),
            ValidateLifetime = false
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);

        if (!(securityToken is JwtSecurityToken jwtSecurityToken) ||
            !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256,
                StringComparison.InvariantCultureIgnoreCase))
        {
            return null;
        }

        return principal;
    }
}
```

**ApplyFlow.Infrastructure/Services/PasswordHashingService.cs:**
```csharp
using BCrypt.Net;

namespace ApplyFlow.Infrastructure.Services;

public interface IPasswordHashingService
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string hash);
}

public class PasswordHashingService : IPasswordHashingService
{
    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, workFactor: 11);
    }

    public bool VerifyPassword(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }
}
```

### 5. DTOs

**ApplyFlow.Application/DTOs/Auth/RegisterRequestDto.cs:**
```csharp
namespace ApplyFlow.Application.DTOs.Auth;

public class RegisterRequestDto
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string ConfirmPassword { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}
```

**ApplyFlow.Application/DTOs/Auth/LoginRequestDto.cs:**
```csharp
namespace ApplyFlow.Application.DTOs.Auth;

public class LoginRequestDto
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}
```

**ApplyFlow.Application/DTOs/Auth/AuthResponseDto.cs:**
```csharp
namespace ApplyFlow.Application.DTOs.Auth;

public class AuthResponseDto
{
    public string AccessToken { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
    public int ExpiresIn { get; set; }
    public UserDto User { get; set; } = null!;
}

public class UserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}
```

**ApplyFlow.Application/DTOs/Applications/CreateApplicationDto.cs:**
```csharp
namespace ApplyFlow.Application.DTOs.Applications;

public class CreateApplicationDto
{
    public string CompanyName { get; set; } = null!;
    public string PositionTitle { get; set; } = null!;
    public DateTime ApplicationDate { get; set; }
    public string? JobUrl { get; set; }
    public string? Location { get; set; }
    public string? RecruiterName { get; set; }
    public string? RecruiterEmail { get; set; }
    public string? Notes { get; set; }
}
```

**ApplyFlow.Application/DTOs/Applications/ApplicationResponseDto.cs:**
```csharp
namespace ApplyFlow.Application.DTOs.Applications;

public class ApplicationResponseDto
{
    public Guid Id { get; set; }
    public string CompanyName { get; set; } = null!;
    public string PositionTitle { get; set; } = null!;
    public DateTime ApplicationDate { get; set; }
    public string? JobUrl { get; set; }
    public string? Location { get; set; }
    public string? RecruiterName { get; set; }
    public string? RecruiterEmail { get; set; }
    public string? Notes { get; set; }
    public short StatusId { get; set; }
    public string StatusName { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

### 6. Validators

**ApplyFlow.Application/Validators/RegisterValidator.cs:**
```csharp
using ApplyFlow.Application.DTOs.Auth;
using FluentValidation;

namespace ApplyFlow.Application.Validators;

public class RegisterValidator : AbstractValidator<RegisterRequestDto>
{
    public RegisterValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Email must be valid");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters");

        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.Password).WithMessage("Passwords must match");

        RuleFor(x => x.FirstName)
            .MaximumLength(100).WithMessage("First name cannot exceed 100 characters");

        RuleFor(x => x.LastName)
            .MaximumLength(100).WithMessage("Last name cannot exceed 100 characters");
    }
}
```

**ApplyFlow.Application/Validators/LoginValidator.cs:**
```csharp
using ApplyFlow.Application.DTOs.Auth;
using FluentValidation;

namespace ApplyFlow.Application.Validators;

public class LoginValidator : AbstractValidator<LoginRequestDto>
{
    public LoginValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Email must be valid");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required");
    }
}
```

**ApplyFlow.Application/Validators/CreateApplicationValidator.cs:**
```csharp
using ApplyFlow.Application.DTOs.Applications;
using FluentValidation;

namespace ApplyFlow.Application.Validators;

public class CreateApplicationValidator : AbstractValidator<CreateApplicationDto>
{
    public CreateApplicationValidator()
    {
        RuleFor(x => x.CompanyName)
            .NotEmpty().WithMessage("Company name is required")
            .MaximumLength(255).WithMessage("Company name cannot exceed 255 characters");

        RuleFor(x => x.PositionTitle)
            .NotEmpty().WithMessage("Position title is required")
            .MaximumLength(255).WithMessage("Position title cannot exceed 255 characters");

        RuleFor(x => x.ApplicationDate)
            .NotEmpty().WithMessage("Application date is required")
            .LessThanOrEqualTo(DateTime.Today).WithMessage("Application date cannot be in the future");

        RuleFor(x => x.JobUrl)
            .Must(x => string.IsNullOrEmpty(x) || Uri.TryCreate(x, UriKind.Absolute, out _))
            .WithMessage("Job URL must be a valid URL");

        RuleFor(x => x.Location)
            .MaximumLength(255).WithMessage("Location cannot exceed 255 characters");

        RuleFor(x => x.RecruiterEmail)
            .EmailAddress().WithMessage("Recruiter email must be valid")
            .When(x => !string.IsNullOrEmpty(x.RecruiterEmail));
    }
}
```

### 7. Services

**ApplyFlow.Application/Services/IAuthenticationService.cs:**
```csharp
using ApplyFlow.Application.DTOs.Auth;

namespace ApplyFlow.Application.Services;

public interface IAuthenticationService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request);
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
}
```

**ApplyFlow.Application/Services/AuthenticationService.cs:**
```csharp
using ApplyFlow.Application.DTOs.Auth;
using ApplyFlow.Domain.Entities;
using ApplyFlow.Infrastructure.Repositories;
using ApplyFlow.Infrastructure.Services;
using AutoMapper;

namespace ApplyFlow.Application.Services;

public class AuthenticationService : IAuthenticationService
{
    private readonly UserRepository _userRepository;
    private readonly IPasswordHashingService _passwordHashingService;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IMapper _mapper;

    public AuthenticationService(
        UserRepository userRepository,
        IPasswordHashingService passwordHashingService,
        IJwtTokenService jwtTokenService,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _passwordHashingService = passwordHashingService;
        _jwtTokenService = jwtTokenService;
        _mapper = mapper;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        var existingUser = await _userRepository.GetByEmailAsync(request.Email);
        if (existingUser != null)
            throw new InvalidOperationException("Email already registered");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            PasswordHash = _passwordHashingService.HashPassword(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName,
            IsActive = true
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        var accessToken = _jwtTokenService.GenerateAccessToken(user.Id, user.Email);
        var refreshToken = _jwtTokenService.GenerateRefreshToken();

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresIn = 15,
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName
            }
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null || !_passwordHashingService.VerifyPassword(request.Password, user.PasswordHash))
            throw new InvalidOperationException("Invalid email or password");

        var accessToken = _jwtTokenService.GenerateAccessToken(user.Id, user.Email);
        var refreshToken = _jwtTokenService.GenerateRefreshToken();

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresIn = 15,
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName
            }
        };
    }
}
```

### 8. Controllers

**ApplyFlow.Api/Controllers/AuthController.cs:**
```csharp
using ApplyFlow.Application.DTOs.Auth;
using ApplyFlow.Application.Services;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace ApplyFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthenticationService _authService;
    private readonly IValidator<RegisterRequestDto> _registerValidator;
    private readonly IValidator<LoginRequestDto> _loginValidator;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IAuthenticationService authService,
        IValidator<RegisterRequestDto> registerValidator,
        IValidator<LoginRequestDto> loginValidator,
        ILogger<AuthController> logger)
    {
        _authService = authService;
        _registerValidator = registerValidator;
        _loginValidator = loginValidator;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        var validationResult = await _registerValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
            return BadRequest(validationResult.Errors);

        try
        {
            var response = await _authService.RegisterAsync(request);
            return Created("", response);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var validationResult = await _loginValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
            return BadRequest(validationResult.Errors);

        try
        {
            var response = await _authService.LoginAsync(request);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }
}
```

**ApplyFlow.Api/Controllers/ApplicationController.cs:**
```csharp
using ApplyFlow.Application.DTOs.Applications;
using ApplyFlow.Infrastructure.Repositories;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ApplyFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicationController : ControllerBase
{
    private readonly ApplicationRepository _repository;
    private readonly IValidator<CreateApplicationDto> _validator;
    private readonly ILogger<ApplicationController> _logger;

    public ApplicationController(
        ApplicationRepository repository,
        IValidator<CreateApplicationDto> validator,
        ILogger<ApplicationController> logger)
    {
        _repository = repository;
        _validator = validator;
        _logger = logger;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
            throw new UnauthorizedAccessException("User ID not found in token");
        return Guid.Parse(userIdClaim);
    }

    [HttpGet]
    public async Task<IActionResult> List(int page = 1, int pageSize = 20, short? status = null, string? search = null)
    {
        var userId = GetUserId();
        var (items, total) = await _repository.GetUserApplicationsPagedAsync(userId, page, pageSize, status, search);
        
        var response = new
        {
            items = items.Select(a => new ApplicationResponseDto
            {
                Id = a.Id,
                CompanyName = a.CompanyName,
                PositionTitle = a.PositionTitle,
                ApplicationDate = a.ApplicationDate,
                JobUrl = a.JobUrl,
                Location = a.Location,
                RecruiterName = a.RecruiterName,
                RecruiterEmail = a.RecruiterEmail,
                Notes = a.Notes,
                StatusId = a.StatusId,
                StatusName = a.Status.DisplayName,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt
            }),
            totalCount = total,
            pageNumber = page,
            pageSize = pageSize,
            totalPages = (int)Math.Ceiling(total / (double)pageSize)
        };

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateApplicationDto request)
    {
        var validationResult = await _validator.ValidateAsync(request);
        if (!validationResult.IsValid)
            return BadRequest(validationResult.Errors);

        try
        {
            var userId = GetUserId();
            var application = new Domain.Entities.Application
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CompanyName = request.CompanyName,
                PositionTitle = request.PositionTitle,
                ApplicationDate = request.ApplicationDate,
                JobUrl = request.JobUrl,
                Location = request.Location,
                RecruiterName = request.RecruiterName,
                RecruiterEmail = request.RecruiterEmail,
                Notes = request.Notes,
                StatusId = 1 // APPLIED
            };

            await _repository.AddAsync(application);
            await _repository.SaveChangesAsync();

            return Created($"api/applications/{application.Id}", new { id = application.Id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating application");
            return StatusCode(500, new { message = "Error creating application" });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var userId = GetUserId();
        var app = await _repository.GetUserApplicationAsync(id, userId);
        if (app == null)
            return NotFound();

        return Ok(new ApplicationResponseDto
        {
            Id = app.Id,
            CompanyName = app.CompanyName,
            PositionTitle = app.PositionTitle,
            ApplicationDate = app.ApplicationDate,
            JobUrl = app.JobUrl,
            Location = app.Location,
            RecruiterName = app.RecruiterName,
            RecruiterEmail = app.RecruiterEmail,
            Notes = app.Notes,
            StatusId = app.StatusId,
            StatusName = app.Status.DisplayName,
            CreatedAt = app.CreatedAt,
            UpdatedAt = app.UpdatedAt
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateApplicationDto request)
    {
        var validationResult = await _validator.ValidateAsync(request);
        if (!validationResult.IsValid)
            return BadRequest(validationResult.Errors);

        var userId = GetUserId();
        var app = await _repository.GetUserApplicationAsync(id, userId);
        if (app == null)
            return NotFound();

        app.CompanyName = request.CompanyName;
        app.PositionTitle = request.PositionTitle;
        app.ApplicationDate = request.ApplicationDate;
        app.JobUrl = request.JobUrl;
        app.Location = request.Location;
        app.RecruiterName = request.RecruiterName;
        app.RecruiterEmail = request.RecruiterEmail;
        app.Notes = request.Notes;
        app.UpdatedAt = DateTime.UtcNow;

        _repository.Update(app);
        await _repository.SaveChangesAsync();

        return Ok(new { message = "Application updated" });
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateStatusDto request)
    {
        var userId = GetUserId();
        var app = await _repository.GetUserApplicationAsync(id, userId);
        if (app == null)
            return NotFound();

        app.StatusId = request.StatusId;
        app.UpdatedAt = DateTime.UtcNow;

        _repository.Update(app);
        await _repository.SaveChangesAsync();

        return Ok(new { message = "Status updated" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetUserId();
        var app = await _repository.GetUserApplicationAsync(id, userId);
        if (app == null)
            return NotFound();

        app.DeletedAt = DateTime.UtcNow;
        _repository.Update(app);
        await _repository.SaveChangesAsync();

        return Ok(new { message = "Application deleted" });
    }
}

public class UpdateStatusDto
{
    public short StatusId { get; set; }
}
```

### 9. Program.cs Configuration

**ApplyFlow.Api/Program.cs:**
```csharp
using ApplyFlow.Application.Validators;
using ApplyFlow.Application.Services;
using ApplyFlow.Infrastructure.Data;
using ApplyFlow.Infrastructure.Repositories;
using ApplyFlow.Infrastructure.Services;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Logging
builder.Host.UseSerilog((context, logConfig) =>
    logConfig.WriteTo.Console()
             .MinimumLevel.Information());

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositories
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<ApplicationRepository>();

// Services
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
builder.Services.AddScoped<IPasswordHashingService, PasswordHashingService>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();

// Validators
builder.Services.AddValidatorsFromAssemblyContaining<RegisterValidator>();

// AutoMapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// JWT Authentication
var jwtSecret = builder.Configuration["JwtSettings:Secret"];
var key = Encoding.ASCII.GetBytes(jwtSecret!);

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Database Migration
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

---

## 🧪 TESTING STRATEGY

### Test Coverage Plan

```
Identified Coverage Areas:

1. Authentication Service (Unit Tests)
   ├─ Register: Valid input, duplicate email, validation
   ├─ Login: Valid credentials, invalid password, user not found
   └─ Token generation: Token format, expiration

2. Password Hashing Service (Unit Tests)
   ├─ Hash password: Produces different hash each time
   ├─ Verify password: Correct password, wrong password
   └─ Security: BCrypt work factor verified

3. Application Repository (Unit Tests)
   ├─ CRUD operations: Create, read, update, delete
   ├─ User isolation: Only user's own applications returned
   ├─ Soft delete: Deleted_at handling
   ├─ Pagination: Correct offset/limit, total count
   └─ Filtering: By status, search term

4. API Controllers (Integration Tests)
   ├─ Authentication: Register, login, unauthorized access
   ├─ Applications: Create, read list, read single, update, delete
   ├─ Authorization: Protected endpoints, user isolation
   └─ Error handling: 404, 400, 500 responses

Target Coverage: > 75%
Critical Paths: Authentication, data access, user isolation
```

### Example Unit Test

**ApplyFlow.Tests/Unit/AuthenticationServiceTests.cs:**
```csharp
using ApplyFlow.Application.DTOs.Auth;
using ApplyFlow.Application.Services;
using ApplyFlow.Infrastructure.Repositories;
using ApplyFlow.Infrastructure.Services;
using Moq;
using Xunit;

namespace ApplyFlow.Tests.Unit;

public class AuthenticationServiceTests
{
    [Fact]
    public async Task RegisterAsync_WithValidInput_CreatesUserAndReturnsToken()
    {
        // Arrange
        var mockUserRepo = new Mock<UserRepository>(MockBehavior.Strict);
        var mockPasswordService = new Mock<IPasswordHashingService>();
        var mockJwtService = new Mock<IJwtTokenService>();
        var mockMapper = new Mock<IMapper>();

        var request = new RegisterRequestDto
        {
            Email = "test@example.com",
            Password = "Password123!",
            FirstName = "John",
            LastName = "Doe"
        };

        mockUserRepo.Setup(r => r.GetByEmailAsync(request.Email))
            .ReturnsAsync((Domain.Entities.User?)null);
        
        mockPasswordService.Setup(s => s.HashPassword(request.Password))
            .Returns("hashed_password");

        mockJwtService.Setup(s => s.GenerateAccessToken(It.IsAny<Guid>(), request.Email))
            .Returns("access_token");

        mockJwtService.Setup(s => s.GenerateRefreshToken())
            .Returns("refresh_token");

        var service = new AuthenticationService(
            mockUserRepo.Object,
            mockPasswordService.Object,
            mockJwtService.Object,
            mockMapper.Object);

        // Act
        var result = await service.RegisterAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("access_token", result.AccessToken);
        Assert.Equal("refresh_token", result.RefreshToken);
        mockUserRepo.Verify(r => r.AddAsync(It.IsAny<Domain.Entities.User>()), Times.Once);
    }

    [Fact]
    public async Task RegisterAsync_WithDuplicateEmail_ThrowsException()
    {
        // Arrange
        var mockUserRepo = new Mock<UserRepository>(MockBehavior.Strict);
        var existingUser = new Domain.Entities.User { Email = "test@example.com" };
        
        mockUserRepo.Setup(r => r.GetByEmailAsync("test@example.com"))
            .ReturnsAsync(existingUser);

        var request = new RegisterRequestDto
        {
            Email = "test@example.com",
            Password = "Password123!"
        };

        var service = new AuthenticationService(
            mockUserRepo.Object,
            Mock.Of<IPasswordHashingService>(),
            Mock.Of<IJwtTokenService>(),
            Mock.Of<IMapper>());

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => service.RegisterAsync(request));
    }
}
```

---

## 🚀 NEXT STEPS (Day-by-Day)

### **Day 1: Setup & Database**
```
✓ Create project structure (30 mins)
✓ Install NuGet packages (15 mins)
✓ Create DbContext (30 mins)
✓ Run database migrations (15 mins)
✓ Test database connection (15 mins)

CHECKPOINT: Can connect to PostgreSQL from .NET
```

### **Day 2: Authentication**
```
✓ Create User entity (15 mins)
✓ Implement JWT service (30 mins)
✓ Implement password hashing (15 mins)
✓ Create AuthController (30 mins)
✓ Test with Postman (30 mins)

CHECKPOINT: Can register and login users
```

### **Day 3: CRUD Operations**
```
✓ Create Application entity (15 mins)
✓ Create ApplicationRepository (45 mins)
✓ Create ApplicationController (1 hour)
✓ Create validators (30 mins)
✓ Test endpoints (30 mins)

CHECKPOINT: Can perform CRUD on applications
```

### **Day 4: Testing & Polish**
```
✓ Write unit tests (2 hours)
✓ Write integration tests (1.5 hours)
✓ Fix bugs (1 hour)

CHECKPOINT: > 75% test coverage, all tests passing
```

---

## 📊 TESTING CHECKLIST

- [ ] Unit Tests: AuthenticationService
- [ ] Unit Tests: PasswordHashingService
- [ ] Unit Tests: ApplicationRepository
- [ ] Integration Tests: AuthController
- [ ] Integration Tests: ApplicationController
- [ ] Test Coverage: > 75%
- [ ] All Tests Passing: ✅
- [ ] No Console Errors: ✅

---

## ✅ BUILD COMPLETION CHECKLIST

- [ ] Project structure created
- [ ] Database connected
- [ ] User registration working
- [ ] User login working with JWT
- [ ] Create application working
- [ ] List applications with pagination working
- [ ] Update application working
- [ ] Delete application (soft delete) working
- [ ] Filter by status working
- [ ] Search by company/position working
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] > 75% code coverage
- [ ] No SQL injection vulnerabilities
- [ ] Passwords properly hashed
- [ ] User isolation enforced
- [ ] All endpoints secured with JWT
- [ ] Error handling implemented
- [ ] Swagger documentation working

---

**YAY! Backend ready for Day 1 build! Start with the Project Setup Instructions above.** 🎉

Ab aap directly code krna start kar sakte ho - Pure structure tayyar hai! 💪

