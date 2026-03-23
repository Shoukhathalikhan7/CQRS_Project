using MediatR;
using Microsoft.AspNetCore.Mvc;
using CqrsAuthProject.Models;
using CqrsAuthProject.Application.Commands;


namespace CqrsAuthProject.Controllers;
using CqrsAuthProject.Application.Queries;  // ✅ REQUIRED


[ApiController]
[Route("api/[controller]")]
public class LearningPathController : ControllerBase
{
    private readonly IMediator _mediator;

    public LearningPathController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // OLD API (keep it)
    [HttpPost]
    public async Task<IActionResult> Create(CreateLearningPathCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(id);
    }

    // ✅ NEW BULK API
 [HttpPost("bulk")]
public async Task<IActionResult> CreateCourses([FromBody] List<CourseDto> courses)
{
    await _mediator.Send(new CreateCoursesCommand { Courses = courses });
    return Ok(new { message = "Courses saved successfully" });
}

[HttpPost("upsert")]
public async Task<IActionResult> Upsert([FromBody] UpsertCoursesCommand command)
{
    await _mediator.Send(command);
    return Ok(new { message = "Upsert success" });
}

 
    [HttpGet]
public async Task<IActionResult> GetAll()
{
    var result = await _mediator.Send(new GetAllLearningPathsQuery());
    return Ok(result);
}
}