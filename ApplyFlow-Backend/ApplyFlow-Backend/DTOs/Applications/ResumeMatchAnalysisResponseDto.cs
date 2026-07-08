namespace ApplyFlow_Backend.DTOs.Applications;

public class ResumeMatchAnalysisResponseDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ApplicationId { get; set; }
    public Guid ResumeId { get; set; }
    public Guid JobDescriptionId { get; set; }
    public int MatchScore { get; set; }
    public string? ResumeDomain { get; set; }
    public string? JobDescriptionDomain { get; set; }
    public double? SimilarityPercent { get; set; }
    public int? SkillScore { get; set; }
    public int? DomainScore { get; set; }
    public string? Feedback { get; set; }
    public IReadOnlyList<string> ResumeSkills { get; set; } = [];
    public IReadOnlyList<string> JobDescriptionSkills { get; set; } = [];
    public IReadOnlyList<string> MatchedKeywords { get; set; } = [];
    public IReadOnlyList<string> MissingKeywords { get; set; } = [];
    public IReadOnlyList<string> Suggestions { get; set; } = [];
    public string? Warning { get; set; }
    public DateTime CreatedAt { get; set; }
}
