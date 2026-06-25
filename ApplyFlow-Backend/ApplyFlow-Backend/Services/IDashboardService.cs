using ApplyFlow_Backend.DTOs.Dashboard;

namespace ApplyFlow_Backend.Services;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetSummaryAsync(Guid userId);
    Task<IReadOnlyList<StatusDistributionDto>> GetStatusDistributionAsync(Guid userId);
    Task<IReadOnlyList<MonthlyStatsDto>> GetMonthlyStatsAsync(Guid userId);
}
