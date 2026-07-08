using System.Text.Json;
using ApplyFlow_Backend.Data;
using ApplyFlow_Backend.DTOs.AiService;
using ApplyFlow_Backend.DTOs.Applications;
using ApplyFlow_Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace ApplyFlow_Backend.Services;

public class ApplicationMatchService : IApplicationMatchService
{
    private readonly AppDbContext _context;
    private readonly IAiResumeAnalysisClient _aiResumeAnalysisClient;

    public ApplicationMatchService(AppDbContext context)
        : this(context, new LocalResumeAnalysisClient()) { }

    public ApplicationMatchService(
        AppDbContext context,
        IAiResumeAnalysisClient aiResumeAnalysisClient)
    {
        _context = context;
        _aiResumeAnalysisClient = aiResumeAnalysisClient;
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

        var aiAnalysis = await _aiResumeAnalysisClient.AnalyzeAsync(new AiResumeAnalysisRequest
        {
            JobDescription = jobDescription.RawText,
            FileName = resume.FileName,
            ContentType = resume.ContentType,
            FileContentBase64 = Convert.ToBase64String(resume.FileContent)
        });

        var warnings = aiAnalysis.Warnings
            .Where(warning => !string.IsNullOrWhiteSpace(warning))
            .ToList();

        var analysis = new ResumeMatchAnalysis
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ApplicationId = applicationId,
            ResumeId = resume.Id,
            JobDescriptionId = jobDescription.Id,
            MatchScore = aiAnalysis.AtsScore,
            ResumeDomain = aiAnalysis.ResumeDomain,
            JobDescriptionDomain = aiAnalysis.JobDescriptionDomain,
            SimilarityPercent = aiAnalysis.SimilarityPercent,
            SkillScore = aiAnalysis.SkillScore,
            DomainScore = aiAnalysis.DomainScore,
            Feedback = aiAnalysis.Feedback,
            ResumeSkillsJson = JsonSerializer.Serialize(aiAnalysis.ResumeSkills),
            JobDescriptionSkillsJson = JsonSerializer.Serialize(aiAnalysis.JobDescriptionSkills),
            MatchedKeywordsJson = JsonSerializer.Serialize(aiAnalysis.MatchedSkills),
            MissingKeywordsJson = JsonSerializer.Serialize(aiAnalysis.MissingSkills),
            SuggestionsJson = JsonSerializer.Serialize(aiAnalysis.Suggestions),
            CreatedAt = DateTime.UtcNow
        };

        _context.ResumeMatchAnalyses.Add(analysis);
        await _context.SaveChangesAsync();

        return ToMatchAnalysisResponse(analysis, warnings.Count == 0 ? null : string.Join(" ", warnings));
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
            ResumeDomain = analysis.ResumeDomain,
            JobDescriptionDomain = analysis.JobDescriptionDomain,
            SimilarityPercent = analysis.SimilarityPercent,
            SkillScore = analysis.SkillScore,
            DomainScore = analysis.DomainScore,
            Feedback = analysis.Feedback,
            ResumeSkills = DeserializeStringList(analysis.ResumeSkillsJson),
            JobDescriptionSkills = DeserializeStringList(analysis.JobDescriptionSkillsJson),
            MatchedKeywords = DeserializeStringList(analysis.MatchedKeywordsJson),
            MissingKeywords = DeserializeStringList(analysis.MissingKeywordsJson),
            Suggestions = DeserializeStringList(analysis.SuggestionsJson),
            Warning = warning,
            CreatedAt = analysis.CreatedAt
        };
    }

    private static IReadOnlyList<string> DeserializeStringList(string json)
    {
        if (string.IsNullOrWhiteSpace(json))
        {
            return [];
        }

        return JsonSerializer.Deserialize<IReadOnlyList<string>>(json) ?? [];
    }
}
