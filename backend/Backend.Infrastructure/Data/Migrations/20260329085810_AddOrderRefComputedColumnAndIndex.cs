using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderRefComputedColumnAndIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "order_ref",
                table: "orders",
                type: "character varying(30)",
                maxLength: 30,
                nullable: true,
                computedColumnSql: "LOWER('ord-' || id::text)",
                stored: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_orders_order_ref",
                table: "orders",
                column: "order_ref"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(name: "ix_orders_order_ref", table: "orders");

            migrationBuilder.DropColumn(name: "order_ref", table: "orders");
        }
    }
}
