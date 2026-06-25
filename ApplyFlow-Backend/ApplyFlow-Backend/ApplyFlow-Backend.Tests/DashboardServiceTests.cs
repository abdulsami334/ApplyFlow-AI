using ApplyFlow_Backend.Data;
using ApplyFlow_Backend.Models;
using ApplyFlow_Backend.Services;
using Microsoft.EntityFrameworkCore;

namespace ApplyFlow_Backend.Tests;

public class DashboardServiceTests
{
    [Fact]
    public async Task GetSummaryAsync_ReturnsCountsForCurrentUserOnly()
    {
        await using var context = CreateContext();
        var service = new DashboardService(context);
        var currentUserId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();

        await SeedApplicationAsync(context, currentUserId, "Applied", new DateTime(2026, 1, 5, 0, 0, 0, DateTimeKind.Utc));
        await SeedApplicationAsync(context, currentUserId, "Interview", new DateTime(2026, 1, 10, 0, 0, 0, DateTimeKind.Utc));
        await SeedApplicationAsync(context, currentUserId, "Offer", new DateTime(2026, 2, 1, 0, 0, 0, DateTimeKind.Utc));
        await SeedApplicationAsync(context, otherUserId, "Rejected", new DateTime(2026, 2, 1, 0, 0, 0, DateTimeKind.Utc));

        var summary = await service.GetSummaryAsync(currentUserId);

        Assert.Equal(3, summary.TotalApplications);
        Assert.Equal(1, summary.Applied);
        Assert.Equal(1, summary.Interview);
        Assert.Equal(1, summary.Offers);
        Assert.Equal(0, summary.Rejected);
    }

    [Fact]
    public async Task GetMonthlyStatsAsync_GroupsCurrentUserApplicationsByMonth()
    {
        await using var context = CreateContext();
        var service = new DashboardService(context);
        var currentUserId = Guid.NewGuid();

        await SeedApplicationAsync(context, currentUserId, "Applied", new DateTime(2026, 1, 5, 0, 0, 0, DateTimeKind.Utc));
        await SeedApplicationAsync(context, currentUserId, "Interview", new DateTime(2026, 1, 10, 0, 0, 0, DateTimeKind.Utc));
        await SeedApplicationAsync(context, currentUserId, "Offer", new DateTime(2026, 2, 1, 0, 0, 0, DateTimeKind.Utc));

        var monthlyStats = await service.GetMonthlyStatsAsync(currentUserId);

        Assert.Equal(2, monthlyStats.Count);
        Assert.Equal(2026, monthlyStats[0].Year);
        Assert.Equal(1, monthlyStats[0].Month);
        Assert.Equal(2, monthlyStats[0].Count);
        Assert.Equal(2, monthlyStats[1].Month);
        Assert.Equal(1, monthlyStats[1].Count);
    }

    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    private static async Task SeedApplicationAsync(AppDbContext context, Guid userId, string status, DateTime applicationDate)
    {
        context.Applications.Add(new Application
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            CompanyName = "OpenAI",
            PositionTitle = "Backend Engineer",
            ApplicationDate = applicationDate,
            Status = status,
            CreatedAt = DateTime.UtcNow
        });

        await context.SaveChangesAsync();
    }
}
