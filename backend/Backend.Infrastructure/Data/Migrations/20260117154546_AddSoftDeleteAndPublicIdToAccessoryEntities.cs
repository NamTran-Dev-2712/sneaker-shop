using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSoftDeleteAndPublicIdToAccessoryEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_deleted",
                table: "category_accessories",
                type: "boolean",
                nullable: false,
                defaultValue: false
            );

            migrationBuilder.AddColumn<bool>(
                name: "is_deleted",
                table: "brand_category_accessories",
                type: "boolean",
                nullable: false,
                defaultValue: false
            );

            migrationBuilder.AddColumn<string>(
                name: "public_id",
                table: "brand_category_accessories",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "public_id",
                table: "accessory_images",
                type: "text",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "public_id",
                table: "accessories",
                type: "text",
                nullable: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "is_deleted", table: "category_accessories");

            migrationBuilder.DropColumn(name: "is_deleted", table: "brand_category_accessories");

            migrationBuilder.DropColumn(name: "public_id", table: "brand_category_accessories");

            migrationBuilder.DropColumn(name: "public_id", table: "accessory_images");

            migrationBuilder.DropColumn(name: "public_id", table: "accessories");
        }
    }
}
