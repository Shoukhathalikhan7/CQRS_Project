using MediatR;
using CqrsAuthProject.Models;

namespace CqrsAuthProject.Application.Commands;

public class CreateCoursesCommand : IRequest<Unit>
{
    public List<CourseDto> Courses { get; set; } = new();
}