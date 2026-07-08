using System.Net.Http.Json;
using ApplyFlow_Backend.DTOs.AiService;
using Microsoft.Extensions.Options;

namespace ApplyFlow_Backend.Services;

public class AiServiceOptions
{
    public string BaseUrl { get; set; } = "http://localhost:8000";
    public int TimeoutSeconds { get; set; } = 30;
}

public class AiResumeAnalysisClient : IAiResumeAnalysisClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<AiResumeAnalysisClient> _logger;

    public AiResumeAnalysisClient(
        HttpClient httpClient,
        IOptions<AiServiceOptions> options,
        ILogger<AiResumeAnalysisClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;

        var baseUrl = options.Value.BaseUrl.TrimEnd('/');
        _httpClient.BaseAddress = new Uri(baseUrl);
        _httpClient.Timeout = TimeSpan.FromSeconds(options.Value.TimeoutSeconds);
    }

    public async Task<AiResumeAnalysisResponse> AnalyzeAsync(
        AiResumeAnalysisRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _httpClient.PostAsJsonAsync(
                "/api/resume-analysis",
                request,
                cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogWarning(
                    "AI service returned {StatusCode}: {Body}",
                    response.StatusCode,
                    body);

                throw new InvalidOperationException("AI service could not analyze the resume.");
            }

            var analysis = await response.Content.ReadFromJsonAsync<AiResumeAnalysisResponse>(
                cancellationToken: cancellationToken);

            return analysis ?? throw new InvalidOperationException("AI service returned an empty response.");
        }
        catch (TaskCanceledException ex) when (!cancellationToken.IsCancellationRequested)
        {
            _logger.LogError(ex, "AI service request timed out.");
            throw new InvalidOperationException("AI service request timed out.", ex);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "AI service request failed.");
            throw new InvalidOperationException("AI service is unavailable.", ex);
        }
    }
}
