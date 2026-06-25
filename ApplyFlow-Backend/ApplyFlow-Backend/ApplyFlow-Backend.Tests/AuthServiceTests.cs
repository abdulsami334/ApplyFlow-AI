using ApplyFlow_Backend.Data;
using ApplyFlow_Backend.DTOs.Auth;
using ApplyFlow_Backend.Models;
using ApplyFlow_Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ApplyFlow_Backend.Tests;

public class AuthServiceTests
{
    [Fact]
    public async Task RegisterAsync_WithValidRequest_CreatesUserWithHashedPasswordAndReturnsToken()
    {
        await using var context = CreateContext();
        var service = CreateService(context);

        var response = await service.RegisterAsync(new RegisterRequestDto
        {
            Email = "Test@Example.com",
            Password = "Password123!"
        });

        var user = await context.Users.SingleAsync();

        Assert.NotEqual(Guid.Empty, response.User.Id);
        Assert.Equal("test@example.com", response.User.Email);
        Assert.False(string.IsNullOrWhiteSpace(response.Token));
        Assert.True(response.ExpiresAt > DateTime.UtcNow);
        Assert.Equal("test@example.com", user.Email);
        Assert.NotEqual("Password123!", user.PasswordHash);
        Assert.True(BCrypt.Net.BCrypt.Verify("Password123!", user.PasswordHash));
    }

    [Fact]
    public async Task RegisterAsync_WithExistingEmail_ThrowsInvalidOperationException()
    {
        await using var context = CreateContext();
        var service = CreateService(context);

        await service.RegisterAsync(new RegisterRequestDto
        {
            Email = "test@example.com",
            Password = "Password123!"
        });

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            service.RegisterAsync(new RegisterRequestDto
            {
                Email = "TEST@example.com",
                Password = "Another123!"
            }));
    }

    [Fact]
    public async Task LoginAsync_WithValidCredentials_ReturnsTokenAndUser()
    {
        await using var context = CreateContext();
        var service = CreateService(context);

        await SeedUserAsync(context, "test@example.com", "Password123!");

        var response = await service.LoginAsync(new LoginRequestDto
        {
            Email = "test@example.com",
            Password = "Password123!"
        });

        Assert.False(string.IsNullOrWhiteSpace(response.Token));
        Assert.Equal("test@example.com", response.User.Email);
    }

    [Fact]
    public async Task LoginAsync_WithInvalidPassword_ThrowsUnauthorizedAccessException()
    {
        await using var context = CreateContext();
        var service = CreateService(context);

        await SeedUserAsync(context, "test@example.com", "Password123!");

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            service.LoginAsync(new LoginRequestDto
            {
                Email = "test@example.com",
                Password = "WrongPassword123!"
            }));
    }

    [Fact]
    public async Task GetCurrentUserAsync_WithExistingUser_ReturnsUserWithoutPasswordHash()
    {
        await using var context = CreateContext();
        var user = await SeedUserAsync(context, "test@example.com", "Password123!");
        var service = CreateService(context);

        var response = await service.GetCurrentUserAsync(user.Id);

        Assert.NotNull(response);
        Assert.Equal(user.Id, response.Id);
        Assert.Equal(user.Email, response.Email);
    }

    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    private static AuthService CreateService(AppDbContext context)
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "applyflow-test-secret-key-with-32-chars",
                ["Jwt:Issuer"] = "ApplyFlow.Tests",
                ["Jwt:Audience"] = "ApplyFlow.Tests",
                ["Jwt:ExpiresInMinutes"] = "60"
            })
            .Build();

        return new AuthService(context, configuration);
    }

    private static async Task<User> SeedUserAsync(AppDbContext context, string email, string password)
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            CreatedAt = DateTime.UtcNow
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return user;
    }
}
