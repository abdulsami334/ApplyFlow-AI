using ApplyFlow_Backend.Data;
using ApplyFlow_Backend.DTOs.Dashboard;
using Microsoft.EntityFrameworkCore;

namespace ApplyFlow_Backend.Services;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _context;

    public DashboardService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardSummaryDto> GetSummaryAsync(Guid userId)
    {
        var counts = await _context.Applications
            .AsNoTracking()
            .Where(application => application.UserId == userId)
            .GroupBy(application => application.Status)
            .Select(group => new { Status = group.Key, Count = group.Count() })
            .ToListAsync();

        var countByStatus = counts.ToDictionary(item => item.Status, item => item.Count, StringComparer.OrdinalIgnoreCase);

        return new DashboardSummaryDto
        {
            TotalApplications = counts.Sum(item => item.Count),
            Applied = GetCount(countByStatus, "Applied"),
            Screening = GetCount(countByStatus, "Screening"),
            Interview = GetCount(countByStatus, "Interview"),
            Offers = GetCount(countByStatus, "Offer"),
            Rejected = GetCount(countByStatus, "Rejected"),
            Withdrawn = GetCount(countByStatus, "Withdrawn")
        };
    }

    public async Task<IReadOnlyList<StatusDistributionDto>> GetStatusDistributionAsync(Guid userId)
    {
        var counts = await _context.Applications
            .AsNoTracking()
            .Where(application => application.UserId == userId)
            .GroupBy(application => application.Status)
            .Select(group => new StatusDistributionDto
            {
                Status = group.Key,
                Count = group.Count()
            })
            .ToListAsync();

        return ApplicationService.ValidStatuses
            .Select(status => new StatusDistributionDto
            {
                Status = status,
                Count = counts.FirstOrDefault(item => item.Status.Equals(status, StringComparison.OrdinalIgnoreCase))?.Count ?? 0
            })
            .ToList();
    }

    public async Task<IReadOnlyList<MonthlyStatsDto>> GetMonthlyStatsAsync(Guid userId)
    {
        var monthlyCounts = await _context.Applications
            .AsNoTracking()
            .Where(application => application.UserId == userId)
            .GroupBy(application => new
            {
                application.ApplicationDate.Year,
                application.ApplicationDate.Month
            })
            .Select(group => new
            {
                group.Key.Year,
                group.Key.Month,
                Count = group.Count()
            })
            .OrderBy(item => item.Year)
            .ThenBy(item => item.Month)
            .ToListAsync();

        return monthlyCounts
            .Select(item => new MonthlyStatsDto
            {
                Year = item.Year,
                Month = item.Month,
                MonthName = new DateTime(item.Year, item.Month, 1).ToString("MMMM"),
                Count = item.Count
            })
            .ToList();
    }

    private static int GetCount(Dictionary<string, int> countByStatus, string status)
    {
        return countByStatus.TryGetValue(status, out var count) ? count : 0;
    }
}
