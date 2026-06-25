using System.Text;
using ApplyFlow_Backend.Data;
using ApplyFlow_Backend.Models;
using ApplyFlow_Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace ApplyFlow_Backend.Tests;

public class ResumeServiceTests
{
    [Fact]
    public async Task UploadAsync_WithValidFile_CreatesResumeForCurrentUser()
    {
        await using var context = CreateContext();
        var service = new ResumeService(context);
        var userId = Guid.NewGuid();

        var response = await service.UploadAsync(
            userId,
            CreateFile(" resume.pdf ", "application/pdf", "pdf content"));

        var saved = await context.Resumes.SingleAsync();

        Assert.Equal(userId, response.UserId);
        Assert.Equal(userId, saved.UserId);
        Assert.Equal("resume.pdf", response.FileName);
        Assert.Equal("application/pdf", response.ContentType);
        Assert.Equal(saved.FileSize, response.FileSize);
        Assert.NotEmpty(saved.FileContent);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsOnlyCurrentUserResumes()
    {
        await using var context = CreateContext();
        var service = new ResumeService(context);
        var currentUserId = Guid.NewGuid();

        await SeedResumeAsync(context, currentUserId, "current.pdf");
        await SeedResumeAsync(context, Guid.NewGuid(), "other.pdf");

        var resumes = await service.GetAllAsync(currentUserId);

        Assert.Single(resumes);
        Assert.Equal("current.pdf", resumes[0].FileName);
        Assert.Equal(currentUserId, resumes[0].UserId);
    }

    [Fact]
    public async Task DeleteAsync_ForDifferentUsersResume_ReturnsFalse()
    {
        await using var context = CreateContext();
        var service = new ResumeService(context);
        var otherResume = await SeedResumeAsync(context, Guid.NewGuid(), "other.pdf");

        var deleted = await service.DeleteAsync(Guid.NewGuid(), otherResume.Id);

        Assert.False(deleted);
        Assert.Single(await context.Resumes.ToListAsync());
    }

    [Theory]
    [InlineData("resume.exe", "application/octet-stream")]
    [InlineData("resume.pdf", "application/octet-stream")]
    public async Task UploadAsync_WithInvalidFile_ThrowsArgumentException(string fileName, string contentType)
    {
        await using var context = CreateContext();
        var service = new ResumeService(context);

        await Assert.ThrowsAsync<ArgumentException>(() =>
            service.UploadAsync(Guid.NewGuid(), CreateFile(fileName, contentType, "content")));
    }

    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    private static IFormFile CreateFile(string fileName, string contentType, string content)
    {
        var bytes = Encoding.UTF8.GetBytes(content);
        return new FormFile(new MemoryStream(bytes), 0, bytes.Length, "file", fileName)
        {
            Headers = new HeaderDictionary(),
            ContentType = contentType
        };
    }

    private static async Task<Resume> SeedResumeAsync(AppDbContext context, Guid userId, string fileName)
    {
        var resume = new Resume
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            FileName = fileName,
            ContentType = "application/pdf",
            FileSize = 12,
            FileContent = [1, 2, 3],
            UploadedAt = DateTime.UtcNow
        };

        context.Resumes.Add(resume);
        await context.SaveChangesAsync();

        return resume;
    }
}
