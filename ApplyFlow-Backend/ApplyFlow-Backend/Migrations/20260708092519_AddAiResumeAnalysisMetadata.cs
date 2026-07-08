using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplyFlow_Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAiResumeAnalysisMetadata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DomainScore",
                table: "ResumeMatchAnalyses",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Feedback",
                table: "ResumeMatchAnalyses",
                type: "character varying(4000)",
                maxLength: 4000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "JobDescriptionDomain",
                table: "ResumeMatchAnalyses",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "JobDescriptionSkillsJson",
                table: "ResumeMatchAnalyses",
                type: "text",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddColumn<string>(
                name: "ResumeDomain",
                table: "ResumeMatchAnalyses",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ResumeSkillsJson",
                table: "ResumeMatchAnalyses",
                type: "text",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddColumn<double>(
                name: "SimilarityPercent",
                table: "ResumeMatchAnalyses",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SkillScore",
                table: "ResumeMatchAnalyses",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DomainScore",
                table: "ResumeMatchAnalyses");

            migrationBuilder.DropColumn(
                name: "Feedback",
                table: "ResumeMatchAnalyses");

            migrationBuilder.DropColumn(
                name: "JobDescriptionDomain",
                table: "ResumeMatchAnalyses");

            migrationBuilder.DropColumn(
                name: "JobDescriptionSkillsJson",
                table: "ResumeMatchAnalyses");

            migrationBuilder.DropColumn(
                name: "ResumeDomain",
                table: "ResumeMatchAnalyses");

            migrationBuilder.DropColumn(
                name: "ResumeSkillsJson",
                table: "ResumeMatchAnalyses");

            migrationBuilder.DropColumn(
                name: "SimilarityPercent",
                table: "ResumeMatchAnalyses");

            migrationBuilder.DropColumn(
                name: "SkillScore",
                table: "ResumeMatchAnalyses");
        }
    }
}
