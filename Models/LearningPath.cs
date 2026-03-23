public class LearningPath
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public List<LearningVideo> Videos { get; set; } = new();
}

public class LearningVideo
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;
    public string VideoUrl { get; set; } = string.Empty;

    public int LearningPathId { get; set; }
}