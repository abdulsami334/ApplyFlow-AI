using System;
using ApplyFlow_Backend.Data;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Infrastructure;

#nullable disable

namespace ApplyFlow_Backend.Migrations
{
    /// <inheritdoc />
    [DbContext(typeof(AppDbContext))]
    [Migration("20260625183000_AddApplicationResumeMatchWorkspace")]
    public partial class AddApplicationResumeMatchWorkspace : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "JobDescriptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ApplicationId = table.Column<Guid>(type: "uuid", nullable: false),
                    RawText = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobDescriptions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ResumeMatchAnalyses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ApplicationId = table.Column<Guid>(type: "uuid", nullable: false),
                    ResumeId = table.Column<Guid>(type: "uuid", nullable: false),
                    JobDescriptionId = table.Column<Guid>(type: "uuid", nullable: false),
                    MatchScore = table.Column<int>(type: "integer", nullable: false),
                    MatchedKeywordsJson = table.Column<string>(type: "text", nullable: false),
                    MissingKeywordsJson = table.Column<string>(type: "text", nullable: false),
                    SuggestionsJson = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResumeMatchAnalyses", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_JobDescriptions_ApplicationId",
                table: "JobDescriptions",
                column: "ApplicationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_JobDescriptions_UserId",
                table: "JobDescriptions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ResumeMatchAnalyses_ApplicationId",
                table: "ResumeMatchAnalyses",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_ResumeMatchAnalyses_JobDescriptionId",
                table: "ResumeMatchAnalyses",
                column: "JobDescriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_ResumeMatchAnalyses_ResumeId",
                table: "ResumeMatchAnalyses",
                column: "ResumeId");

            migrationBuilder.CreateIndex(
                name: "IX_ResumeMatchAnalyses_UserId",
                table: "ResumeMatchAnalyses",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JobDescriptions");

            migrationBuilder.DropTable(
                name: "ResumeMatchAnalyses");
        }
    }
}
