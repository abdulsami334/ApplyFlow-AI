using ApplyFlow_Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace ApplyFlow_Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Application> Applications => Set<Application>();
    public DbSet<Resume> Resumes => Set<Resume>();
    public DbSet<JobDescription> JobDescriptions => Set<JobDescription>();
    public DbSet<ResumeMatchAnalysis> ResumeMatchAnalyses => Set<ResumeMatchAnalysis>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(user => user.Id);
            entity.Property(user => user.Email).IsRequired().HasMaxLength(255);
            entity.Property(user => user.PasswordHash).IsRequired().HasMaxLength(255);
            entity.Property(user => user.CreatedAt).IsRequired();
            entity.HasIndex(user => user.Email).IsUnique();
        });

        modelBuilder.Entity<Application>(entity =>
        {
            entity.HasKey(application => application.Id);
            entity.Property(application => application.CompanyName).IsRequired().HasMaxLength(255);
            entity.Property(application => application.PositionTitle).IsRequired().HasMaxLength(255);
            entity.Property(application => application.ApplicationDate).IsRequired();
            entity.Property(application => application.Status).IsRequired().HasMaxLength(50);
            entity.Property(application => application.Location).HasMaxLength(255);
            entity.Property(application => application.JobType).HasMaxLength(100);
            entity.Property(application => application.WorkMode).HasMaxLength(100);
            entity.Property(application => application.Source).HasMaxLength(255);
            entity.Property(application => application.SalaryRange).HasMaxLength(100);
            entity.Property(application => application.ContactName).HasMaxLength(255);
            entity.Property(application => application.ContactEmail).HasMaxLength(255);
            entity.Property(application => application.JobUrl).HasMaxLength(1000);
            entity.Property(application => application.Notes).HasMaxLength(2000);
            entity.Property(application => application.CreatedAt).IsRequired();
            entity.HasIndex(application => application.UserId);
        });

        modelBuilder.Entity<Resume>(entity =>
        {
            entity.HasKey(resume => resume.Id);
            entity.Property(resume => resume.FileName).IsRequired().HasMaxLength(255);
            entity.Property(resume => resume.ContentType).IsRequired().HasMaxLength(255);
            entity.Property(resume => resume.FileSize).IsRequired();
            entity.Property(resume => resume.FileContent).IsRequired();
            entity.Property(resume => resume.UploadedAt).IsRequired();
            entity.HasIndex(resume => resume.UserId);
        });

        modelBuilder.Entity<JobDescription>(entity =>
        {
            entity.HasKey(jobDescription => jobDescription.Id);
            entity.Property(jobDescription => jobDescription.RawText).IsRequired();
            entity.Property(jobDescription => jobDescription.CreatedAt).IsRequired();
            entity.Property(jobDescription => jobDescription.UpdatedAt).IsRequired();
            entity.HasIndex(jobDescription => jobDescription.UserId);
            entity.HasIndex(jobDescription => jobDescription.ApplicationId).IsUnique();
        });

        modelBuilder.Entity<ResumeMatchAnalysis>(entity =>
        {
            entity.HasKey(analysis => analysis.Id);
            entity.Property(analysis => analysis.MatchScore).IsRequired();
            entity.Property(analysis => analysis.MatchedKeywordsJson).IsRequired();
            entity.Property(analysis => analysis.MissingKeywordsJson).IsRequired();
            entity.Property(analysis => analysis.SuggestionsJson).IsRequired();
            entity.Property(analysis => analysis.CreatedAt).IsRequired();
            entity.HasIndex(analysis => analysis.UserId);
            entity.HasIndex(analysis => analysis.ApplicationId);
            entity.HasIndex(analysis => analysis.ResumeId);
            entity.HasIndex(analysis => analysis.JobDescriptionId);
        });
    }
}
