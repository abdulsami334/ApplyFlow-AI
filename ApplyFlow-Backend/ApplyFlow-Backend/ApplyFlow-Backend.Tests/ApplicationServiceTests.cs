using ApplyFlow_Backend.Data;
using ApplyFlow_Backend.DTOs.Applications;
using ApplyFlow_Backend.Models;
using ApplyFlow_Backend.Services;
using Microsoft.EntityFrameworkCore;

namespace ApplyFlow_Backend.Tests;

public class ApplicationServiceTests
{
    [Fact]
    public async Task CreateAsync_WithValidRequest_CreatesApplicationForCurrentUser()
    {
        await using var context = CreateContext();
        var service = new ApplicationService(context);
        var userId = Guid.NewGuid();

        var response = await service.CreateAsync(userId, new CreateApplicationRequestDto
        {
            CompanyName = " OpenAI ",
            PositionTitle = " Backend Engineer ",
            ApplicationDate = new DateTime(2026, 6, 24, 0, 0, 0, DateTimeKind.Utc),
            Status = "applied",
            Location = " Remote ",
            JobType = " Full-time ",
            WorkMode = " Hybrid ",
            Source = " LinkedIn ",
            SalaryRange = " $120k - $150k ",
            ContactName = " Jane Recruiter ",
            ContactEmail = " JANE@EXAMPLE.COM ",
            JobUrl = " https://example.com/jobs/backend ",
            FollowUpDate = new DateTime(2026, 6, 30, 0, 0, 0, DateTimeKind.Utc),
            Notes = " Great role "
        });

        var saved = await context.Applications.SingleAsync();

        Assert.Equal(userId, response.UserId);
        Assert.Equal(userId, saved.UserId);
        Assert.Equal("OpenAI", response.CompanyName);
        Assert.Equal("Backend Engineer", response.PositionTitle);
        Assert.Equal("Applied", response.Status);
        Assert.Equal("Remote", response.Location);
        Assert.Equal("Full-time", response.JobType);
        Assert.Equal("Hybrid", response.WorkMode);
        Assert.Equal("LinkedIn", response.Source);
        Assert.Equal("$120k - $150k", response.SalaryRange);
        Assert.Equal("Jane Recruiter", response.ContactName);
        Assert.Equal("jane@example.com", response.ContactEmail);
        Assert.Equal("https://example.com/jobs/backend", response.JobUrl);
        Assert.Equal(new DateTime(2026, 6, 30, 0, 0, 0, DateTimeKind.Utc), response.FollowUpDate);
        Assert.Equal("Great role", response.Notes);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsOnlyCurrentUserApplications()
    {
        await using var context = CreateContext();
        var service = new ApplicationService(context);
        var currentUserId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();

        await SeedApplicationAsync(context, currentUserId, "OpenAI", "Applied");
        await SeedApplicationAsync(context, otherUserId, "Other Company", "Interview");

        var applications = await service.GetAllAsync(currentUserId);

        Assert.Single(applications);
        Assert.Equal("OpenAI", applications[0].CompanyName);
        Assert.Equal(currentUserId, applications[0].UserId);
    }

    [Fact]
    public async Task UpdateAsync_ForDifferentUsersApplication_ReturnsNull()
    {
        await using var context = CreateContext();
        var service = new ApplicationService(context);
        var currentUserId = Guid.NewGuid();
        var otherApplication = await SeedApplicationAsync(context, Guid.NewGuid(), "OpenAI", "Applied");

        var response = await service.UpdateAsync(currentUserId, otherApplication.Id, new UpdateApplicationRequestDto
        {
            CompanyName = "Updated",
            PositionTitle = "Updated",
            ApplicationDate = DateTime.UtcNow,
            Status = "Offer"
        });

        Assert.Null(response);
    }

    [Fact]
    public async Task CreateAsync_WithInvalidStatus_ThrowsArgumentException()
    {
        await using var context = CreateContext();
        var service = new ApplicationService(context);

        await Assert.ThrowsAsync<ArgumentException>(() =>
            service.CreateAsync(Guid.NewGuid(), new CreateApplicationRequestDto
            {
                CompanyName = "OpenAI",
                PositionTitle = "Backend Engineer",
                ApplicationDate = DateTime.UtcNow,
                Status = "Unknown"
            }));
    }

    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    private static async Task<Application> SeedApplicationAsync(AppDbContext context, Guid userId, string companyName, string status)
    {
        var application = new Application
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            CompanyName = companyName,
            PositionTitle = "Backend Engineer",
            ApplicationDate = DateTime.UtcNow,
            Status = status,
            CreatedAt = DateTime.UtcNow
        };

        context.Applications.Add(application);
        await context.SaveChangesAsync();

        return application;
    }
}
