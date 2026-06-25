using System.Security.Claims;
using ApplyFlow_Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApplyFlow_Backend.Controllers;

[ApiController]
[Authorize]
[Route("api/resumes")]
public class ResumesController : ControllerBase
{
    private readonly IResumeService _resumeService;

    public ResumesController(IResumeService resumeService)
    {
        _resumeService = resumeService;
    }

    [HttpPost]
    [RequestSizeLimit(ResumeService.MaxFileSizeBytes)]
    public async Task<IActionResult> Upload(IFormFile? file)
    {
        if (file is null)
        {
            return BadRequest(new { message = "Resume file is required." });
        }

        try
        {
            var resume = await _resumeService.UploadAsync(GetCurrentUserId(), file);
            return Created($"/api/resumes/{resume.Id}", resume);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var resumes = await _resumeService.GetAllAsync(GetCurrentUserId());
        return Ok(resumes);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _resumeService.DeleteAsync(GetCurrentUserId(), id);
        return deleted ? NoContent() : NotFound(new { message = "Resume not found." });
    }

    private Guid GetCurrentUserId()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdValue, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user token.");
        }

        return userId;
    }
}
