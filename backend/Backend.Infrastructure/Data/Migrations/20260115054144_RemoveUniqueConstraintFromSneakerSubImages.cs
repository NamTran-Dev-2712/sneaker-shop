using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUniqueConstraintFromSneakerSubImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_sneaker_sub_images_sneaker_id",
                table: "sneaker_sub_images"
            );

            migrationBuilder.CreateIndex(
                name: "ix_sneaker_sub_images_sneaker_id",
                table: "sneaker_sub_images",
                column: "sneaker_id"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_sneaker_sub_images_sneaker_id",
                table: "sneaker_sub_images"
            );

            migrationBuilder.CreateIndex(
                name: "ix_sneaker_sub_images_sneaker_id",
                table: "sneaker_sub_images",
                column: "sneaker_id",
                unique: true
            );
        }
    }
}
