using ApplyFlow_Backend.DTOs.AiService;

namespace ApplyFlow_Backend.Services;

public interface IAiResumeAnalysisClient
{
    Task<AiResumeAnalysisResponse> AnalyzeAsync(
        AiResumeAnalysisRequest request,
        CancellationToken cancellationToken = default);
}
