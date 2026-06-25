using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using ApplyFlow_Backend.Data;
using ApplyFlow_Backend.DTOs.Applications;
using ApplyFlow_Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace ApplyFlow_Backend.Services;

public class ApplicationMatchService : IApplicationMatchService
{
    private const string ExtractionWarning =
        "Resume text extraction is not available yet. Please add extracted text support or upload a text-readable file.";

    private static readonly HashSet<string> StopWords = new(StringComparer.OrdinalIgnoreCase)
    {
        "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "in", "is", "it",
        "of", "on", "or", "that", "the", "this", "to", "with", "you", "your", "we", "our",
        "will", "can", "have", "has", "job", "role", "team", "work", "experience", "years"
    };

    private readonly AppDbContext _context;

    public ApplicationMatchService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<JobDescriptionResponseDto> CreateJobDescriptionAsync(
        Guid userId,
        Guid applicationId,
        JobDescriptionRequestDto request)
    {
        await EnsureApplicationOwnedAsync(userId, applicationId);

        var existing = await _context.JobDescriptions
            .FirstOrDefaultAsync(jobDescription =>
                jobDescription.ApplicationId == applicationId && jobDescription.UserId == userId);

        if (existing is not null)
        {
            existing.RawText = NormalizeJobDescription(request.RawText);
            existing.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return ToJobDescriptionResponse(existing);
        }

        var now = DateTime.UtcNow;
        var jobDescription = new JobDescription
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ApplicationId = applicationId,
            RawText = NormalizeJobDescription(request.RawText),
            CreatedAt = now,
            UpdatedAt = now
        };

        _context.JobDescriptions.Add(jobDescription);
        await _context.SaveChangesAsync();

        return ToJobDescriptionResponse(jobDescription);
    }

    public async Task<JobDescriptionResponseDto?> GetJobDescriptionAsync(Guid userId, Guid applicationId)
    {
        await EnsureApplicationOwnedAsync(userId, applicationId);

        var jobDescription = await _context.JobDescriptions
            .AsNoTracking()
            .FirstOrDefaultAsync(description =>
                description.ApplicationId == applicationId && description.UserId == userId);

        return jobDescription is null ? null : ToJobDescriptionResponse(jobDescription);
    }

    public async Task<JobDescriptionResponseDto?> UpdateJobDescriptionAsync(
        Guid userId,
        Guid applicationId,
        JobDescriptionRequestDto request)
    {
        await EnsureApplicationOwnedAsync(userId, applicationId);

        var jobDescription = await _context.JobDescriptions
            .FirstOrDefaultAsync(description =>
                description.ApplicationId == applicationId && description.UserId == userId);

        if (jobDescription is null)
        {
            return null;
        }

        jobDescription.RawText = NormalizeJobDescription(request.RawText);
        jobDescription.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return ToJobDescriptionResponse(jobDescription);
    }

    public async Task<ResumeMatchAnalysisResponseDto> CreateMatchAnalysisAsync(
        Guid userId,
        Guid applicationId,
        CreateMatchAnalysisRequestDto request)
    {
        await EnsureApplicationOwnedAsync(userId, applicationId);

        var jobDescription = await _context.JobDescriptions
            .AsNoTracking()
            .FirstOrDefaultAsync(description =>
                description.ApplicationId == applicationId && description.UserId == userId);

        if (jobDescription is null)
        {
            throw new ArgumentException("Add a job description before running match analysis.");
        }

        var resume = await _context.Resumes
            .AsNoTracking()
            .FirstOrDefaultAsync(existingResume =>
                existingResume.Id == request.ResumeId && existingResume.UserId == userId);

        if (resume is null)
        {
            throw new ArgumentException("Resume not found.");
        }

        var jobKeywords = ExtractKeywords(jobDescription.RawText);
        var resumeText = ExtractResumeText(resume);
        var resumeKeywords = ExtractKeywords(resumeText);
        var matchedKeywords = jobKeywords
            .Where(keyword => resumeKeywords.Contains(keyword))
            .ToList();
        var missingKeywords = jobKeywords
            .Where(keyword => !resumeKeywords.Contains(keyword))
            .ToList();

        var score = jobKeywords.Count == 0
            ? 0
            : (int)Math.Round((double)matchedKeywords.Count / jobKeywords.Count * 100);

        var suggestions = BuildSuggestions(missingKeywords, resumeText);

        var analysis = new ResumeMatchAnalysis
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ApplicationId = applicationId,
            ResumeId = resume.Id,
            JobDescriptionId = jobDescription.Id,
            MatchScore = score,
            MatchedKeywordsJson = JsonSerializer.Serialize(matchedKeywords),
            MissingKeywordsJson = JsonSerializer.Serialize(missingKeywords),
            SuggestionsJson = JsonSerializer.Serialize(suggestions),
            CreatedAt = DateTime.UtcNow
        };

        _context.ResumeMatchAnalyses.Add(analysis);
        await _context.SaveChangesAsync();

        return ToMatchAnalysisResponse(analysis, string.IsNullOrWhiteSpace(resumeText) ? ExtractionWarning : null);
    }

    public async Task<ResumeMatchAnalysisResponseDto?> GetLatestMatchAnalysisAsync(Guid userId, Guid applicationId)
    {
        await EnsureApplicationOwnedAsync(userId, applicationId);

        var analysis = await _context.ResumeMatchAnalyses
            .AsNoTracking()
            .Where(existingAnalysis =>
                existingAnalysis.ApplicationId == applicationId && existingAnalysis.UserId == userId)
            .OrderByDescending(existingAnalysis => existingAnalysis.CreatedAt)
            .FirstOrDefaultAsync();

        return analysis is null ? null : ToMatchAnalysisResponse(analysis);
    }

    private async Task EnsureApplicationOwnedAsync(Guid userId, Guid applicationId)
    {
        var exists = await _context.Applications
            .AnyAsync(application => application.Id == applicationId && application.UserId == userId);

        if (!exists)
        {
            throw new KeyNotFoundException("Application not found.");
        }
    }

    private static string NormalizeJobDescription(string rawText)
    {
        if (string.IsNullOrWhiteSpace(rawText))
        {
            throw new ArgumentException("Job description is required.");
        }

        return rawText.Trim();
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

    private static string ExtractResumeText(Resume resume)
    {
        if (string.Equals(resume.ContentType, "text/plain", StringComparison.OrdinalIgnoreCase))
        {
            return Encoding.UTF8.GetString(resume.FileContent);
        }

        return string.Empty;
    }

    private static IReadOnlyList<string> BuildSuggestions(IReadOnlyList<string> missingKeywords, string resumeText)
    {
        if (string.IsNullOrWhiteSpace(resumeText))
        {
            return [ExtractionWarning];
        }

        if (missingKeywords.Count == 0)
        {
            return ["Your resume already covers the main keywords detected in this job description."];
        }

        return missingKeywords
            .Take(5)
            .Select(keyword => $"Consider adding evidence for '{keyword}' if it matches your real experience.")
            .ToList();
    }

    private static JobDescriptionResponseDto ToJobDescriptionResponse(JobDescription jobDescription)
    {
        return new JobDescriptionResponseDto
        {
            Id = jobDescription.Id,
            UserId = jobDescription.UserId,
            ApplicationId = jobDescription.ApplicationId,
            RawText = jobDescription.RawText,
            CreatedAt = jobDescription.CreatedAt,
            UpdatedAt = jobDescription.UpdatedAt
        };
    }

    private static ResumeMatchAnalysisResponseDto ToMatchAnalysisResponse(
        ResumeMatchAnalysis analysis,
        string? warning = null)
    {
        return new ResumeMatchAnalysisResponseDto
        {
            Id = analysis.Id,
            UserId = analysis.UserId,
            ApplicationId = analysis.ApplicationId,
            ResumeId = analysis.ResumeId,
            JobDescriptionId = analysis.JobDescriptionId,
            MatchScore = analysis.MatchScore,
            MatchedKeywords = DeserializeStringList(analysis.MatchedKeywordsJson),
            MissingKeywords = DeserializeStringList(analysis.MissingKeywordsJson),
            Suggestions = DeserializeStringList(analysis.SuggestionsJson),
            Warning = warning,
            CreatedAt = analysis.CreatedAt
        };
    }

    private static IReadOnlyList<string> DeserializeStringList(string json)
    {
        return JsonSerializer.Deserialize<IReadOnlyList<string>>(json) ?? [];
    }
}
