using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddLoyaltyReposAndVoucherRedemptionDiscountAmount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "discount_amount",
                table: "voucher_redemptions",
                type: "numeric",
                nullable: false,
                defaultValue: 0m
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "discount_amount", table: "voucher_redemptions");
        }
    }
}
