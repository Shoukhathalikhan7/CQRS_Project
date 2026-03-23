using MediatR;
using CqrsAuthProject.Data;

public class CreateLearningPathHandler : IRequestHandler<CreateLearningPathCommand, int>
{
    private readonly AppDbContext _context;

    public CreateLearningPathHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateLearningPathCommand request, CancellationToken cancellationToken)
    {
        var data = new LearningPath
        {
            Title = request.Title,
            Description = request.Description,
Videos = (request.Videos ?? new List<VideoDto>())
    .Select(v => new LearningVideo
    {
        Title = v.Title ?? "",
        VideoUrl = v.VideoUrl ?? ""
    })
    .ToList()
        };

        _context.LearningPaths.Add(data);
        await _context.SaveChangesAsync();

        return data.Id;
    }
}