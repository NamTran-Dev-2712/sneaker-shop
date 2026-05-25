using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTableCart : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "total_count",
                table: "carts",
                type: "integer",
                nullable: false,
                defaultValue: 0
            );

            migrationBuilder.AddColumn<int>(
                name: "inventory_id",
                table: "cart_items",
                type: "integer",
                nullable: false,
                defaultValue: 0
            );

            migrationBuilder.CreateIndex(
                name: "ix_cart_items_inventory_id",
                table: "cart_items",
                column: "inventory_id"
            );

            migrationBuilder.AddForeignKey(
                name: "fk_cart_items_inventories_inventory_id",
                table: "cart_items",
                column: "inventory_id",
                principalTable: "inventories",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_cart_items_inventories_inventory_id",
                table: "cart_items"
            );

            migrationBuilder.DropIndex(name: "ix_cart_items_inventory_id", table: "cart_items");

            migrationBuilder.DropColumn(name: "total_count", table: "carts");

            migrationBuilder.DropColumn(name: "inventory_id", table: "cart_items");
        }
    }
}
