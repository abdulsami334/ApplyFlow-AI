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
        public string MatchedKeywordsJson { get; set; } = "[]";
        public string MissingKeywordsJson { get; set; } = "[]";
        public string SuggestionsJson { get; set; } = "[]";
        public DateTime CreatedAt { get; set; }
    }
}
