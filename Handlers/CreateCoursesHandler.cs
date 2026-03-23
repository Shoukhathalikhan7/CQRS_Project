using MediatR;
using Dapper;
using System.Data;
using Microsoft.Data.SqlClient;
using CqrsAuthProject.Models;
using CqrsAuthProject.Application.Commands;

namespace CqrsAuthProject.Handlers;

public class CreateCoursesHandler : IRequestHandler<CreateCoursesCommand, Unit>
{
    private readonly IDbConnection _db;

    public CreateCoursesHandler(IConfiguration config)
    {
        _db = new SqlConnection(config.GetConnectionString("DefaultConnection"));
    }

    public async Task<Unit> Handle(CreateCoursesCommand request, CancellationToken cancellationToken)
    {
        foreach (var course in request.Courses)
        {
            // ✅ Insert into LearningPaths
            var learningPathId = await _db.ExecuteScalarAsync<int>(
                @"INSERT INTO LearningPaths (Title, Description)
                  VALUES (@Title, @Description);
                  SELECT CAST(SCOPE_IDENTITY() as int)",
                new
                {
                    Title = course.Title,
                    Description = course.Description
                });

            // ✅ Insert videos into LearningVideos
            foreach (var video in course.Videos)
            {
                await _db.ExecuteAsync(
                    @"INSERT INTO LearningVideos (Title, VideoUrl, LearningPathId)
                      VALUES (@Title, @VideoUrl, @LearningPathId)",
                    new
                    {
                        Title = video.Title,
                        VideoUrl = video.VideoUrl,
                        LearningPathId = learningPathId
                    });
            }
        }

        return Unit.Value;
    }
}