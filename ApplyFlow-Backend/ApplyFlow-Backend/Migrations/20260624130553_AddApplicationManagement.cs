using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplyFlow_Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddApplicationManagement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AppliedDate",
                table: "Applications",
                newName: "ApplicationDate");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Applications",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Applications",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Applications");

            migrationBuilder.RenameColumn(
                name: "ApplicationDate",
                table: "Applications",
                newName: "AppliedDate");
        }
    }
}
