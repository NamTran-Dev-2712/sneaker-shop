using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderSnapshotAndIdempotency : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "idempotency_key",
                table: "orders",
                type: "character varying(36)",
                maxLength: 36,
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "primary_image_url_snapshot",
                table: "order_items",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "product_name_snapshot",
                table: "order_items",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: ""
            );

            migrationBuilder.AddColumn<string>(
                name: "sku_snapshot",
                table: "order_items",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: ""
            );

            migrationBuilder.AddColumn<decimal>(
                name: "unit_price_snapshot",
                table: "order_items",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m
            );

            migrationBuilder.AddColumn<string>(
                name: "variant_name_snapshot",
                table: "order_items",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_orders_idempotency_key",
                table: "orders",
                column: "idempotency_key",
                unique: true,
                filter: "idempotency_key IS NOT NULL"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(name: "ix_orders_idempotency_key", table: "orders");

            migrationBuilder.DropColumn(name: "idempotency_key", table: "orders");

            migrationBuilder.DropColumn(name: "primary_image_url_snapshot", table: "order_items");

            migrationBuilder.DropColumn(name: "product_name_snapshot", table: "order_items");

            migrationBuilder.DropColumn(name: "sku_snapshot", table: "order_items");

            migrationBuilder.DropColumn(name: "unit_price_snapshot", table: "order_items");

            migrationBuilder.DropColumn(name: "variant_name_snapshot", table: "order_items");
        }
    }
}
