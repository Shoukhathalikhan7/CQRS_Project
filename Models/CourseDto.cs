namespace CqrsAuthProject.Models;
public class CourseDto
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public bool IsDeleted { get; set; }

    public List<VideoDto> Videos { get; set; } = new(); // 🔥 REQUIRED
}