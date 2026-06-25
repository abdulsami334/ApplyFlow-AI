using System.Text;
using ApplyFlow_Backend.Data;
using ApplyFlow_Backend.DTOs.Applications;
using ApplyFlow_Backend.Models;
using ApplyFlow_Backend.Services;
using Microsoft.EntityFrameworkCore;

namespace ApplyFlow_Backend.Tests;

public class ApplicationMatchServiceTests
{
    [Fact]
    public async Task CreateMatchAnalysisAsync_WithTextResume_ReturnsDeterministicMatch()
    {
        await using var context = CreateContext();
        var service = new ApplicationMatchService(context);
        var userId = Guid.NewGuid();
        var application = await SeedApplicationAsync(context, userId);
        var resume = await SeedResumeAsync(
            context,
            userId,
            "resume.txt",
            "text/plain",
            "C# dotnet react postgres api");

        await service.CreateJobDescriptionAsync(userId, application.Id, new JobDescriptionRequestDto
        {
            RawText = "Looking for C# dotnet react postgres experience"
        });

        var analysis = await service.CreateMatchAnalysisAsync(userId, application.Id, new CreateMatchAnalysisRequestDto
        {
            ResumeId = resume.Id
        });

        Assert.True(analysis.MatchScore > 0);
        Assert.Contains("react", analysis.MatchedKeywords);
        Assert.DoesNotContain("react", analysis.MissingKeywords);
        Assert.Null(analysis.Warning);
    }

    [Fact]
    public async Task CreateMatchAnalysisAsync_WithNonTextResume_ReturnsExtractionWarning()
    {
        await using var context = CreateContext();
        var service = new ApplicationMatchService(context);
        var userId = Guid.NewGuid();
        var application = await SeedApplicationAsync(context, userId);
        var resume = await SeedResumeAsync(context, userId, "resume.pdf", "application/pdf", "%PDF");

        await service.CreateJobDescriptionAsync(userId, application.Id, new JobDescriptionRequestDto
        {
            RawText = "React TypeScript API"
        });

        var analysis = await service.CreateMatchAnalysisAsync(userId, application.Id, new CreateMatchAnalysisRequestDto
        {
            ResumeId = resume.Id
        });

        Assert.Equal(0, analysis.MatchScore);
        Assert.NotNull(analysis.Warning);
        Assert.Contains("Resume text extraction is not available yet", analysis.Suggestions[0]);
    }

    [Fact]
    public async Task CreateMatchAnalysisAsync_WithDifferentUsersResume_ThrowsArgumentException()
    {
        await using var context = CreateContext();
        var service = new ApplicationMatchService(context);
        var userId = Guid.NewGuid();
        var application = await SeedApplicationAsync(context, userId);
        var otherResume = await SeedResumeAsync(context, Guid.NewGuid(), "other.txt", "text/plain", "react");

        await service.CreateJobDescriptionAsync(userId, application.Id, new JobDescriptionRequestDto
        {
            RawText = "React TypeScript API"
        });

        await Assert.ThrowsAsync<ArgumentException>(() =>
            service.CreateMatchAnalysisAsync(userId, application.Id, new CreateMatchAnalysisRequestDto
            {
                ResumeId = otherResume.Id
            }));
    }

    [Fact]
    public async Task GetJobDescriptionAsync_ForDifferentUsersApplication_ThrowsKeyNotFoundException()
    {
        await using var context = CreateContext();
        var service = new ApplicationMatchService(context);
        var application = await SeedApplicationAsync(context, Guid.NewGuid());

        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            service.GetJobDescriptionAsync(Guid.NewGuid(), application.Id));
    }

    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    private static async Task<Application> SeedApplicationAsync(AppDbContext context, Guid userId)
    {
        var application = new Application
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            CompanyName = "OpenAI",
            PositionTitle = "Software Engineer",
            ApplicationDate = DateTime.UtcNow,
            Status = "Applied",
            CreatedAt = DateTime.UtcNow
        };

        context.Applications.Add(application);
        await context.SaveChangesAsync();

        return application;
    }

    private static async Task<Resume> SeedResumeAsync(
        AppDbContext context,
        Guid userId,
        string fileName,
        string contentType,
        string content)
    {
        var bytes = Encoding.UTF8.GetBytes(content);
        var resume = new Resume
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            FileName = fileName,
            ContentType = contentType,
            FileSize = bytes.Length,
            FileContent = bytes,
            UploadedAt = DateTime.UtcNow
        };

        context.Resumes.Add(resume);
        await context.SaveChangesAsync();

        return resume;
    }
}
