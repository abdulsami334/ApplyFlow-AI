using ApplyFlow_Backend.DTOs.Applications;

namespace ApplyFlow_Backend.Services;

public interface IApplicationService
{
    Task<ApplicationResponseDto> CreateAsync(Guid userId, CreateApplicationRequestDto request);
    Task<IReadOnlyList<ApplicationResponseDto>> GetAllAsync(Guid userId);
    Task<ApplicationResponseDto?> GetByIdAsync(Guid userId, Guid applicationId);
    Task<ApplicationResponseDto?> UpdateAsync(Guid userId, Guid applicationId, UpdateApplicationRequestDto request);
    Task<bool> DeleteAsync(Guid userId, Guid applicationId);
}
