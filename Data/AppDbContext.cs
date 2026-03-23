using Microsoft.EntityFrameworkCore;
using CqrsAuthProject.Models;


namespace CqrsAuthProject.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

        public DbSet<TaskItem> Tasks { get; set; }
    

public DbSet<LearningPath> LearningPaths { get; set; }
public DbSet<LearningVideo> LearningVideos { get; set; }

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<LearningPath>()
        .HasMany(x => x.Videos)
        .WithOne()
        .HasForeignKey(x => x.LearningPathId);
}
}
}