using MediatR;
using CqrsAuthProject.Models;

namespace CqrsAuthProject.Application.Queries;  // ✅ IMPORTANT

public class GetAllLearningPathsQuery : IRequest<List<CourseDto>>
{
}