using System.Security.Claims;
using ApplyFlow_Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApplyFlow_Backend.Controllers;

[ApiController]
[Authorize]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var summary = await _dashboardService.GetSummaryAsync(GetCurrentUserId());
        return Ok(summary);
    }

    [HttpGet("status-distribution")]
    public async Task<IActionResult> GetStatusDistribution()
    {
        var distribution = await _dashboardService.GetStatusDistributionAsync(GetCurrentUserId());
        return Ok(distribution);
    }

    [HttpGet("monthly-stats")]
    public async Task<IActionResult> GetMonthlyStats()
    {
        var monthlyStats = await _dashboardService.GetMonthlyStatsAsync(GetCurrentUserId());
        return Ok(monthlyStats);
    }

    private Guid GetCurrentUserId()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdValue, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user token.");
        }

        return userId;
    }
}
