using ApplyFlow_Backend.DTOs.Applications;

namespace ApplyFlow_Backend.Services;

public interface IApplicationMatchService
{
    Task<JobDescriptionResponseDto> CreateJobDescriptionAsync(Guid userId, Guid applicationId, JobDescriptionRequestDto request);
    Task<JobDescriptionResponseDto?> GetJobDescriptionAsync(Guid userId, Guid applicationId);
    Task<JobDescriptionResponseDto?> UpdateJobDescriptionAsync(Guid userId, Guid applicationId, JobDescriptionRequestDto request);
    Task<ResumeMatchAnalysisResponseDto> CreateMatchAnalysisAsync(Guid userId, Guid applicationId, CreateMatchAnalysisRequestDto request);
    Task<ResumeMatchAnalysisResponseDto?> GetLatestMatchAnalysisAsync(Guid userId, Guid applicationId);
}
