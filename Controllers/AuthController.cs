using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CqrsAuthProject.Application.Queries;
using CqrsAuthProject.Data;
using Microsoft.EntityFrameworkCore;
using CqrsAuthProject.Models;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly AppDbContext _context;

public AuthController(IMediator mediator, AppDbContext context)
{
    _mediator = mediator;
    _context = context;
}

    [HttpPost("signup")]
    public async Task<IActionResult> Signup(RegisterUserCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginUserQuery query)
    {
        var result = await _mediator.Send(query);

        if (result == null)
            return Unauthorized("Invalid Credentials");

        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .Where(u => u.Role == "User") // 🔥 Only show normal users
            .ToListAsync();

        return Ok(users);
    }

 
[Authorize(Roles = "Admin")]
[HttpDelete("delete/{id}")]
public async Task<IActionResult> DeleteUser(int id)
{
    var user = await _context.Users.FindAsync(id);

    if (user == null)
        return BadRequest(new { success = false, message = "User not found" });

    _context.Users.Remove(user);
    await _context.SaveChangesAsync();

    return Ok(new { success = true, message = "User deleted successfully" });
}


    // 🔥 PROMOTE USER TO ADMIN
    [Authorize(Roles = "Admin")]
[HttpPut("promote/{id}")]
public async Task<IActionResult> PromoteUser(int id)
{
    var user = await _context.Users.FindAsync(id);

    if (user == null)
        return NotFound("User not found");

    user.Role = "Admin";
    await _context.SaveChangesAsync();

    return Ok("User promoted successfully");
}
[HttpPost("add-task")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> AddTask([FromBody] TaskItem task)
{
    if (task == null)
        return BadRequest();

    task.Status = "Pending";
    task.Comment = null;

    if (string.IsNullOrEmpty(task.AssignedToEmail))
        return BadRequest("Assigned email required");

    task.Deadline = task.Deadline.ToUniversalTime();

    await _context.Tasks.AddAsync(task);
    await _context.SaveChangesAsync();

    return Ok(new { success = true });
}
// [Authorize]
// [HttpGet("my-tasks")]
// public async Task<IActionResult> GetMyTasks()
// {
//     var email = User.Claims
//         .FirstOrDefault(c => c.Type.Contains("email"))?.Value;

//     if (string.IsNullOrEmpty(email))
//         return Unauthorized("Email not found in token");

//     email = email.Trim().ToLower();

//     var tasks = await _context.Tasks
//         .Where(t => t.AssignedToEmail != null &&
//                     t.AssignedToEmail.Trim().ToLower() == email)
//         .ToListAsync();

//     return Ok(tasks);
// }


[Authorize]
[HttpGet("my-tasks")]
public async Task<IActionResult> GetMyTasks()
{
    var email =
        User.FindFirst(ClaimTypes.Email)?.Value ??
        User.FindFirst("email")?.Value;

    if (string.IsNullOrEmpty(email))
        return Unauthorized("Email missing");

    var tasks = await _context.Tasks
        .Where(t => t.AssignedToEmail == email)
        .ToListAsync();

    return Ok(tasks);
}
    [Authorize]
[HttpPut("update-task/{id}")]
public async Task<IActionResult> UpdateTask(int id, TaskItem updatedTask)
{
    var task = await _context.Tasks.FindAsync(id);
    if (task == null) return NotFound();

    task.Status = updatedTask.Status;
    task.Comment = updatedTask.Comment;

    await _context.SaveChangesAsync();

    return Ok(new { success = true });
}
[Authorize(Roles = "Admin")]
[HttpDelete("delete-task/{id}")]
public async Task<IActionResult> DeleteTask(int id)
{
    var task = await _context.Tasks.FindAsync(id);
    if (task == null) return NotFound();

    _context.Tasks.Remove(task);
    await _context.SaveChangesAsync();

    return Ok(new { success = true });
}
[Authorize(Roles = "Admin")]
[HttpGet("tasks")]
public async Task<IActionResult> GetAllTasks()
{
    var tasks = await _context.Tasks
        .OrderByDescending(t => t.Id)
        .ToListAsync();

    return Ok(tasks);
}

}