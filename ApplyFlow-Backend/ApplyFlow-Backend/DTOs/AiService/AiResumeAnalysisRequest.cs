using System.Text.Json.Serialization;

namespace ApplyFlow_Backend.DTOs.AiService;

public class AiResumeAnalysisRequest
{
    [JsonPropertyName("resume_text")]
    public string? ResumeText { get; set; }

    [JsonPropertyName("job_description")]
    public string JobDescription { get; set; } = string.Empty;

    [JsonPropertyName("file_name")]
    public string? FileName { get; set; }

    [JsonPropertyName("content_type")]
    public string? ContentType { get; set; }

    [JsonPropertyName("file_content_base64")]
    public string? FileContentBase64 { get; set; }
}
