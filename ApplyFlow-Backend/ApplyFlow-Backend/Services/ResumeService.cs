using ApplyFlow_Backend.Data;
using ApplyFlow_Backend.DTOs.Resumes;
using ApplyFlow_Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace ApplyFlow_Backend.Services;

public class ResumeService : IResumeService
{
    public const long MaxFileSizeBytes = 5 * 1024 * 1024;

    private static readonly Dictionary<string, string[]> AllowedContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        [".pdf"] = ["application/pdf"],
        [".doc"] = ["application/msword"],
        [".docx"] = ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        [".txt"] = ["text/plain"]
    };

    private readonly AppDbContext _context;

    public ResumeService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ResumeResponseDto> UploadAsync(Guid userId, IFormFile file)
    {
        ValidateFile(file);

        await using var stream = file.OpenReadStream();
        using var memoryStream = new MemoryStream();
        await stream.CopyToAsync(memoryStream);

        var resume = new Resume
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            FileName = Path.GetFileName(file.FileName).Trim(),
            ContentType = file.ContentType,
            FileSize = file.Length,
            FileContent = memoryStream.ToArray(),
            UploadedAt = DateTime.UtcNow
        };

        _context.Resumes.Add(resume);
        await _context.SaveChangesAsync();

        return ToResponse(resume);
    }

    public async Task<IReadOnlyList<ResumeResponseDto>> GetAllAsync(Guid userId)
    {
        return await _context.Resumes
            .AsNoTracking()
            .Where(resume => resume.UserId == userId)
            .OrderByDescending(resume => resume.UploadedAt)
            .Select(resume => ToResponse(resume))
            .ToListAsync();
    }

    public async Task<bool> DeleteAsync(Guid userId, Guid resumeId)
    {
        var resume = await _context.Resumes
            .FirstOrDefaultAsync(resume => resume.Id == resumeId && resume.UserId == userId);

        if (resume is null)
        {
            return false;
        }

        _context.Resumes.Remove(resume);
        await _context.SaveChangesAsync();

        return true;
    }

    private static void ValidateFile(IFormFile file)
    {
        if (file.Length == 0)
        {
            throw new ArgumentException("Resume file is required.");
        }

        if (file.Length > MaxFileSizeBytes)
        {
            throw new ArgumentException("Resume file must be 5 MB or smaller.");
        }

        var fileName = Path.GetFileName(file.FileName).Trim();
        var extension = Path.GetExtension(fileName);

        if (string.IsNullOrWhiteSpace(fileName) ||
            string.IsNullOrWhiteSpace(extension) ||
            !AllowedContentTypes.TryGetValue(extension, out var contentTypes) ||
            !contentTypes.Contains(file.ContentType, StringComparer.OrdinalIgnoreCase))
        {
            throw new ArgumentException("Resume file must be a PDF, DOC, DOCX, or TXT file.");
        }
    }

    private static ResumeResponseDto ToResponse(Resume resume)
    {
        return new ResumeResponseDto
        {
            Id = resume.Id,
            UserId = resume.UserId,
            FileName = resume.FileName,
            ContentType = resume.ContentType,
            FileSize = resume.FileSize,
            UploadedAt = resume.UploadedAt
        };
    }
}
