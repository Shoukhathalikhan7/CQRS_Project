using MediatR;
using Dapper;
using System.Data;
using Microsoft.Data.SqlClient;
using CqrsAuthProject.Models;
using CqrsAuthProject.Application.Queries;

public class GetAllLearningPathsHandler
    : IRequestHandler<GetAllLearningPathsQuery, List<CourseDto>>
{
    private readonly IDbConnection _db;
    public GetAllLearningPathsHandler(IConfiguration config)
    {
        _db = new SqlConnection(config.GetConnectionString("DefaultConnection"));
    }

    public async Task<List<CourseDto>> Handle(GetAllLearningPathsQuery request, CancellationToken cancellationToken)
    {
        var courses = await _db.QueryAsync<CourseDto>(
            "SELECT Id, Title, Description FROM LearningPaths"
        );

        var result = new List<CourseDto>();

        foreach (var course in courses)
        {
var videos = await _db.QueryAsync<CqrsAuthProject.Models.VideoDto>(
    "SELECT Id, Title, VideoUrl FROM LearningVideos WHERE LearningPathId = @Id",
    new { Id = course.Id }
);
            course.Videos = videos.ToList(); // ✅ FIXED TYPE
            result.Add(course);
        }

        return result;
    }
}