public class UpdateTaskDto
{
    public required string Title { get; set; }
    public required string Description { get; set; }
    public DateTime Deadline { get; set; }
    public required string AssignedToEmail { get; set; }
    public string? Status { get; set; } // optional
}