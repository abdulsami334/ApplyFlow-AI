namespace ApplyFlow_Backend.Models
{
    public class ResumeMatchAnalysis
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
        public string ResumeSkillsJson { get; set; } = "[]";
        public string JobDescriptionSkillsJson { get; set; } = "[]";
        public string MatchedKeywordsJson { get; set; } = "[]";
        public string MissingKeywordsJson { get; set; } = "[]";
        public string SuggestionsJson { get; set; } = "[]";
        public DateTime CreatedAt { get; set; }
    }
}
