using MediatR;
using CqrsAuthProject.Models;

public class UpsertCoursesCommand : IRequest<Unit>
{
    public List<CourseDto> Courses { get; set; } = new();
}