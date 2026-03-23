namespace CqrsAuthProject.Models;

public class VideoDto
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? VideoUrl { get; set; }
    public bool IsDeleted { get; set; }
}