using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplyFlow_Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAdvancedApplicationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContactEmail",
                table: "Applications",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactName",
                table: "Applications",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FollowUpDate",
                table: "Applications",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "JobType",
                table: "Applications",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "JobUrl",
                table: "Applications",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Applications",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SalaryRange",
                table: "Applications",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Source",
                table: "Applications",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WorkMode",
                table: "Applications",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContactEmail",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "ContactName",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "FollowUpDate",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "JobType",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "JobUrl",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "SalaryRange",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "Source",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "WorkMode",
                table: "Applications");

        }
    }
}
