using System.Text.Json.Serialization;

namespace ApplyFlow_Backend.DTOs.AiService;

public class AiResumeAnalysisResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("resume_text")]
    public string ResumeText { get; set; } = string.Empty;

    [JsonPropertyName("resume_domain")]
    public string ResumeDomain { get; set; } = "Unknown";

    [JsonPropertyName("job_description_domain")]
    public string JobDescriptionDomain { get; set; } = "Unknown";

    [JsonPropertyName("similarity_percent")]
    public double SimilarityPercent { get; set; }

    [JsonPropertyName("skill_score")]
    public int SkillScore { get; set; }

    [JsonPropertyName("domain_score")]
    public int DomainScore { get; set; }

    [JsonPropertyName("ats_score")]
    public int AtsScore { get; set; }

    [JsonPropertyName("resume_skills")]
    public IReadOnlyList<string> ResumeSkills { get; set; } = [];

    [JsonPropertyName("job_description_skills")]
    public IReadOnlyList<string> JobDescriptionSkills { get; set; } = [];

    [JsonPropertyName("matched_skills")]
    public IReadOnlyList<string> MatchedSkills { get; set; } = [];

    [JsonPropertyName("missing_skills")]
    public IReadOnlyList<string> MissingSkills { get; set; } = [];

    [JsonPropertyName("resume_keywords")]
    public IReadOnlyList<string> ResumeKeywords { get; set; } = [];

    [JsonPropertyName("job_description_keywords")]
    public IReadOnlyList<string> JobDescriptionKeywords { get; set; } = [];

    [JsonPropertyName("suggestions")]
    public IReadOnlyList<string> Suggestions { get; set; } = [];

    [JsonPropertyName("feedback")]
    public string Feedback { get; set; } = string.Empty;

    [JsonPropertyName("warnings")]
    public IReadOnlyList<string> Warnings { get; set; } = [];
}
