using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddRowTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "average_rating",
                table: "sneakers",
                type: "numeric",
                nullable: false,
                defaultValue: 0m
            );

            migrationBuilder.AddColumn<int>(
                name: "rating_count",
                table: "sneakers",
                type: "integer",
                nullable: false,
                defaultValue: 0
            );

            migrationBuilder.AddColumn<int>(
                name: "selled",
                table: "sneakers",
                type: "integer",
                nullable: false,
                defaultValue: 0
            );

            migrationBuilder.AddColumn<int>(
                name: "view_count",
                table: "sneakers",
                type: "integer",
                nullable: false,
                defaultValue: 0
            );

            migrationBuilder.AddColumn<decimal>(
                name: "average_rating",
                table: "accessories",
                type: "numeric",
                nullable: false,
                defaultValue: 0m
            );

            migrationBuilder.AddColumn<int>(
                name: "rating_count",
                table: "accessories",
                type: "integer",
                nullable: false,
                defaultValue: 0
            );

            migrationBuilder.AddColumn<int>(
                name: "selled",
                table: "accessories",
                type: "integer",
                nullable: false,
                defaultValue: 0
            );

            migrationBuilder.AddColumn<int>(
                name: "view_count",
                table: "accessories",
                type: "integer",
                nullable: false,
                defaultValue: 0
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "average_rating", table: "sneakers");

            migrationBuilder.DropColumn(name: "rating_count", table: "sneakers");

            migrationBuilder.DropColumn(name: "selled", table: "sneakers");

            migrationBuilder.DropColumn(name: "view_count", table: "sneakers");

            migrationBuilder.DropColumn(name: "average_rating", table: "accessories");

            migrationBuilder.DropColumn(name: "rating_count", table: "accessories");

            migrationBuilder.DropColumn(name: "selled", table: "accessories");

            migrationBuilder.DropColumn(name: "view_count", table: "accessories");
        }
    }
}
