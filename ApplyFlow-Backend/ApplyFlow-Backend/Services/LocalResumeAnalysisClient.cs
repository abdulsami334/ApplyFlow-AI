using System.Text;
using System.Text.RegularExpressions;
using ApplyFlow_Backend.DTOs.AiService;

namespace ApplyFlow_Backend.Services;

public class LocalResumeAnalysisClient : IAiResumeAnalysisClient
{
    private static readonly HashSet<string> StopWords = new(StringComparer.OrdinalIgnoreCase)
    {
        "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "in", "is", "it",
        "of", "on", "or", "that", "the", "this", "to", "with", "you", "your", "we", "our",
        "will", "can", "have", "has", "job", "role", "team", "work", "experience", "years"
    };

    public Task<AiResumeAnalysisResponse> AnalyzeAsync(
        AiResumeAnalysisRequest request,
        CancellationToken cancellationToken = default)
    {
        var resumeText = request.ResumeText;

        if (string.IsNullOrWhiteSpace(resumeText) &&
            string.Equals(request.ContentType, "text/plain", StringComparison.OrdinalIgnoreCase) &&
            !string.IsNullOrWhiteSpace(request.FileContentBase64))
        {
            resumeText = Encoding.UTF8.GetString(Convert.FromBase64String(request.FileContentBase64));
        }

        var resumeKeywords = ExtractKeywords(resumeText ?? string.Empty);
        var jobKeywords = ExtractKeywords(request.JobDescription);
        var matched = jobKeywords.Where(keyword => resumeKeywords.Contains(keyword)).ToList();
        var missing = jobKeywords.Where(keyword => !resumeKeywords.Contains(keyword)).ToList();
        var score = jobKeywords.Count == 0 ? 0 : (int)Math.Round((double)matched.Count / jobKeywords.Count * 100);

        var warning = string.IsNullOrWhiteSpace(resumeText)
            ? "Resume text extraction is not available yet. Please add extracted text support or upload a text-readable file."
            : null;

        var suggestions = missing.Count == 0
            ? ["Your resume already covers the main keywords detected in this job description."]
            : missing.Take(5)
                .Select(keyword => $"Consider adding evidence for '{keyword}' if it matches your real experience.")
                .ToList();

        if (warning is not null)
        {
            suggestions.Insert(0, warning);
        }

        return Task.FromResult(new AiResumeAnalysisResponse
        {
            Success = true,
            ResumeText = resumeText ?? string.Empty,
            ResumeDomain = "Unknown",
            JobDescriptionDomain = "Unknown",
            SimilarityPercent = score,
            SkillScore = score,
            DomainScore = 0,
            AtsScore = score,
            ResumeSkills = resumeKeywords.ToList(),
            JobDescriptionSkills = jobKeywords.ToList(),
            MatchedSkills = matched,
            MissingSkills = missing,
            ResumeKeywords = resumeKeywords.ToList(),
            JobDescriptionKeywords = jobKeywords.ToList(),
            Suggestions = suggestions,
            Feedback = string.Join(" ", suggestions),
            Warnings = warning is null ? [] : [warning]
        });
    }

    private static HashSet<string> ExtractKeywords(string text)
    {
        return Regex.Matches(text.ToLowerInvariant(), "[a-z][a-z0-9+#.-]{2,}")
            .Select(match => match.Value.Trim('.', ',', ';', ':', '!', '?'))
            .Where(keyword => keyword.Length >= 3 && !StopWords.Contains(keyword))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Take(40)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
    }
}
