namespace ApplyFlow_Backend.DTOs.Dashboard;

public class DashboardSummaryDto
{
    public int TotalApplications { get; set; }
    public int Applied { get; set; }
    public int Screening { get; set; }
    public int Interview { get; set; }
    public int Offers { get; set; }
    public int Rejected { get; set; }
    public int Withdrawn { get; set; }
}
