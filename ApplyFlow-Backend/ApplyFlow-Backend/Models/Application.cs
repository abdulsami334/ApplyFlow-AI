namespace ApplyFlow_Backend.Models
{
    public class Application
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string PositionTitle { get; set; } = string.Empty;
        public DateTime ApplicationDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Location { get; set; }
        public string? JobType { get; set; }
        public string? WorkMode { get; set; }
        public string? Source { get; set; }
        public string? SalaryRange { get; set; }
        public string? ContactName { get; set; }
        public string? ContactEmail { get; set; }
        public string? JobUrl { get; set; }
        public DateTime? FollowUpDate { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
