using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueProviderTxnIndexForPayments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "ix_payments_provider_provider_txn_id",
                table: "payments",
                columns: new[] { "provider", "provider_txn_id" },
                unique: true,
                filter: "provider_txn_id IS NOT NULL"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_payments_provider_provider_txn_id",
                table: "payments"
            );
        }
    }
}
