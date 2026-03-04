public class TaskItem
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime Deadline { get; set; }

    public string Status { get; set; } = "Pending";

    public string AssignedToEmail { get; set; } = string.Empty;

    public string? Comment { get; set; }
}