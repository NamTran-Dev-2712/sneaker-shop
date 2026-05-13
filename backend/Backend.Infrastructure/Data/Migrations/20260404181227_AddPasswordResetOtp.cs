using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Backend.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPasswordResetOtp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "password_reset_otps",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    account_id = table.Column<int>(type: "integer", nullable: false),
                    email_snapshot = table.Column<string>(
                        type: "character varying(255)",
                        maxLength: 255,
                        nullable: false
                    ),
                    otp_hash = table.Column<string>(
                        type: "character varying(128)",
                        maxLength: 128,
                        nullable: false
                    ),
                    expires_at = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    resend_available_at = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    attempt_count = table.Column<int>(
                        type: "integer",
                        nullable: false,
                        defaultValue: 0
                    ),
                    consumed_at = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: true
                    ),
                    created_at = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false,
                        defaultValueSql: "CURRENT_TIMESTAMP"
                    ),
                    updated_at = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false,
                        defaultValueSql: "CURRENT_TIMESTAMP"
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_password_reset_otps", x => x.id);
                    table.ForeignKey(
                        name: "fk_password_reset_otps_accounts_account_id",
                        column: x => x.account_id,
                        principalTable: "accounts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateIndex(
                name: "ix_password_reset_otps_account_id",
                table: "password_reset_otps",
                column: "account_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_password_reset_otps_account_id_created_at",
                table: "password_reset_otps",
                columns: new[] { "account_id", "created_at" }
            );

            migrationBuilder.CreateIndex(
                name: "ix_password_reset_otps_consumed_at",
                table: "password_reset_otps",
                column: "consumed_at"
            );

            migrationBuilder.CreateIndex(
                name: "ix_password_reset_otps_expires_at",
                table: "password_reset_otps",
                column: "expires_at"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "password_reset_otps");
        }
    }
}
