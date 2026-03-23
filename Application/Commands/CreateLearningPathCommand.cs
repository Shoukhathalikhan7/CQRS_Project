using MediatR;

public class CreateLearningPathCommand : IRequest<int>
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<VideoDto> Videos { get; set; } = new();
}

public class VideoDto
{
    public int Id { get; set; }  // 🔥 REQUIRED
    public string? Title { get; set; }
    public string? VideoUrl { get; set; }
    public bool IsDeleted { get; set; } // 🔥 REQUIRED
}