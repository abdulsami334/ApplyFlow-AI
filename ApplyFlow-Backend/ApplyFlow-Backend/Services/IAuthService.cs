using ApplyFlow_Backend.DTOs.Auth;

namespace ApplyFlow_Backend.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request);
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
    Task<UserResponseDto?> GetCurrentUserAsync(Guid userId);
}
