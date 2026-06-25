using ApplyFlow_Backend.DTOs.Resumes;
using Microsoft.AspNetCore.Http;

namespace ApplyFlow_Backend.Services;

public interface IResumeService
{
    Task<ResumeResponseDto> UploadAsync(Guid userId, IFormFile file);
    Task<IReadOnlyList<ResumeResponseDto>> GetAllAsync(Guid userId);
    Task<bool> DeleteAsync(Guid userId, Guid resumeId);
}
