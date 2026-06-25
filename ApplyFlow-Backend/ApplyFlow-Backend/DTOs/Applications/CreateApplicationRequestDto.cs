using System.ComponentModel.DataAnnotations;

namespace ApplyFlow_Backend.DTOs.Applications;

public class CreateApplicationRequestDto
{
    [Required]
    [MaxLength(255)]
    public string CompanyName { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string PositionTitle { get; set; } = string.Empty;

    [Required]
    public DateTime ApplicationDate { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? Location { get; set; }

    [MaxLength(100)]
    public string? JobType { get; set; }

    [MaxLength(100)]
    public string? WorkMode { get; set; }

    [MaxLength(255)]
    public string? Source { get; set; }

    [MaxLength(100)]
    public string? SalaryRange { get; set; }

    [MaxLength(255)]
    public string? ContactName { get; set; }

    [EmailAddress]
    [MaxLength(255)]
    public string? ContactEmail { get; set; }

    [Url]
    [MaxLength(1000)]
    public string? JobUrl { get; set; }

    public DateTime? FollowUpDate { get; set; }

    [MaxLength(2000)]
    public string? Notes { get; set; }
}
