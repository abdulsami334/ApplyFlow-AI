using System.Security.Claims;
using ApplyFlow_Backend.DTOs.Applications;
using ApplyFlow_Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApplyFlow_Backend.Controllers;

[ApiController]
[Authorize]
[Route("api/applications")]
public class ApplicationsController : ControllerBase
{
    private readonly IApplicationService _applicationService;
    private readonly IApplicationMatchService _applicationMatchService;

    public ApplicationsController(
        IApplicationService applicationService,
        IApplicationMatchService applicationMatchService)
    {
        _applicationService = applicationService;
        _applicationMatchService = applicationMatchService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateApplicationRequestDto request)
    {
        try
        {
            var application = await _applicationService.CreateAsync(GetCurrentUserId(), request);
            return CreatedAtAction(nameof(GetById), new { id = application.Id }, application);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var applications = await _applicationService.GetAllAsync(GetCurrentUserId());
        return Ok(applications);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var application = await _applicationService.GetByIdAsync(GetCurrentUserId(), id);
        return application is null ? NotFound(new { message = "Application not found." }) : Ok(application);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateApplicationRequestDto request)
    {
        try
        {
            var application = await _applicationService.UpdateAsync(GetCurrentUserId(), id, request);
            return application is null ? NotFound(new { message = "Application not found." }) : Ok(application);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _applicationService.DeleteAsync(GetCurrentUserId(), id);
        return deleted ? NoContent() : NotFound(new { message = "Application not found." });
    }

    [HttpPost("{applicationId:guid}/job-description")]
    public async Task<IActionResult> CreateJobDescription(Guid applicationId, JobDescriptionRequestDto request)
    {
        try
        {
            var jobDescription = await _applicationMatchService.CreateJobDescriptionAsync(
                GetCurrentUserId(),
                applicationId,
                request);

            return Created($"/api/applications/{applicationId}/job-description", jobDescription);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{applicationId:guid}/job-description")]
    public async Task<IActionResult> GetJobDescription(Guid applicationId)
    {
        try
        {
            var jobDescription = await _applicationMatchService.GetJobDescriptionAsync(
                GetCurrentUserId(),
                applicationId);

            return jobDescription is null ? NotFound(new { message = "Job description not found." }) : Ok(jobDescription);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut("{applicationId:guid}/job-description")]
    public async Task<IActionResult> UpdateJobDescription(Guid applicationId, JobDescriptionRequestDto request)
    {
        try
        {
            var jobDescription = await _applicationMatchService.UpdateJobDescriptionAsync(
                GetCurrentUserId(),
                applicationId,
                request);

            return jobDescription is null ? NotFound(new { message = "Job description not found." }) : Ok(jobDescription);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{applicationId:guid}/match-analysis")]
    public async Task<IActionResult> CreateMatchAnalysis(Guid applicationId, CreateMatchAnalysisRequestDto request)
    {
        try
        {
            var analysis = await _applicationMatchService.CreateMatchAnalysisAsync(
                GetCurrentUserId(),
                applicationId,
                request);

            return Created($"/api/applications/{applicationId}/match-analysis", analysis);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{applicationId:guid}/match-analysis")]
    public async Task<IActionResult> GetMatchAnalysis(Guid applicationId)
    {
        try
        {
            var analysis = await _applicationMatchService.GetLatestMatchAnalysisAsync(
                GetCurrentUserId(),
                applicationId);

            return analysis is null ? NotFound(new { message = "Match analysis not found." }) : Ok(analysis);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
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
