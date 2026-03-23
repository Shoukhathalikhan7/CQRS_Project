using MediatR;
using Microsoft.EntityFrameworkCore;
using CqrsAuthProject.Data;
using CqrsAuthProject.Models;

public class UpsertCoursesHandler : IRequestHandler<UpsertCoursesCommand, Unit>
{
    private readonly AppDbContext _context;

    public UpsertCoursesHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpsertCoursesCommand request, CancellationToken cancellationToken)
    {
        foreach (var course in request.Courses ?? new List<CourseDto>())
        {
            // ================= DELETE COURSE =================
            if (course.IsDeleted && course.Id > 0)
            {
                var existing = await _context.LearningPaths
                    .Include(x => x.Videos)
                    .FirstOrDefaultAsync(x => x.Id == course.Id);

                if (existing != null)
                {
                    _context.LearningVideos.RemoveRange(existing.Videos);
                    _context.LearningPaths.Remove(existing);
                }

                continue;
            }

            LearningPath? entity;

            // ================= UPDATE COURSE =================
            if (course.Id > 0)
            {
                entity = await _context.LearningPaths
                    .Include(x => x.Videos)
                    .FirstOrDefaultAsync(x => x.Id == course.Id);

                if (entity == null) continue;

                entity.Title = course.Title ?? "";
                entity.Description = course.Description ?? "";
            }
            // ================= INSERT COURSE =================
            else
            {
                entity = new LearningPath
                {
                    Title = course.Title ?? "",
                    Description = course.Description ?? "",
                    Videos = new List<LearningVideo>()
                };

                _context.LearningPaths.Add(entity);
            }

            // ================= VIDEOS =================
            var videos = course.Videos;
            entity.Videos ??= new List<LearningVideo>();

            foreach (var video in course.Videos)
{
    // DELETE
    if (video.IsDeleted && video.Id > 0)
{
    var existingVideo = await _context.LearningVideos
        .FirstOrDefaultAsync(v => v.Id == video.Id);

    if (existingVideo != null)
    {
        _context.LearningVideos.Remove(existingVideo);
    }

    continue;
}

    // UPDATE
    if (video.Id > 0)
    {
        var existingVideo = entity.Videos
            .FirstOrDefault(v => v.Id == video.Id);

        if (existingVideo != null)
        {
            existingVideo.Title = video.Title ?? "";
            existingVideo.VideoUrl = video.VideoUrl ?? "";
        }
    }

    // INSERT
    else if (!video.IsDeleted)
    {
        entity.Videos.Add(new LearningVideo
        {
            Title = video.Title ?? "",
            VideoUrl = video.VideoUrl ?? ""
        });
    }
}
        }

        await _context.SaveChangesAsync();
        return Unit.Value;
    }
}