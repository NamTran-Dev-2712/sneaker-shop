using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Backend.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddFinanceLedgerEntries : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "finance_ledger_entries",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    status = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: false
                    ),
                    amount = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false
                    ),
                    category = table.Column<string>(
                        type: "character varying(100)",
                        maxLength: 100,
                        nullable: false,
                        defaultValue: "GENERAL"
                    ),
                    description = table.Column<string>(
                        type: "character varying(1000)",
                        maxLength: 1000,
                        nullable: true
                    ),
                    source_type = table.Column<string>(
                        type: "character varying(30)",
                        maxLength: 30,
                        nullable: false
                    ),
                    source_id = table.Column<int>(type: "integer", nullable: true),
                    store_id = table.Column<int>(type: "integer", nullable: true),
                    created_by = table.Column<int>(type: "integer", nullable: true),
                    occurred_at = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    metadata_json = table.Column<string>(type: "jsonb", nullable: true),
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
                    table.PrimaryKey("pk_finance_ledger_entries", x => x.id);
                    table.ForeignKey(
                        name: "fk_finance_ledger_entries_accounts_created_by",
                        column: x => x.created_by,
                        principalTable: "accounts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull
                    );
                    table.ForeignKey(
                        name: "fk_finance_ledger_entries_stores_store_id",
                        column: x => x.store_id,
                        principalTable: "stores",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull
                    );
                }
            );

            migrationBuilder.CreateIndex(
                name: "ix_finance_ledger_entries_created_by",
                table: "finance_ledger_entries",
                column: "created_by"
            );

            migrationBuilder.CreateIndex(
                name: "ix_finance_ledger_entries_occurred_at",
                table: "finance_ledger_entries",
                column: "occurred_at"
            );

            migrationBuilder.CreateIndex(
                name: "ix_finance_ledger_entries_source_type",
                table: "finance_ledger_entries",
                column: "source_type"
            );

            migrationBuilder.CreateIndex(
                name: "ix_finance_ledger_entries_source_type_source_id",
                table: "finance_ledger_entries",
                columns: new[] { "source_type", "source_id" },
                unique: true,
                filter: "source_id IS NOT NULL"
            );

            migrationBuilder.CreateIndex(
                name: "ix_finance_ledger_entries_status",
                table: "finance_ledger_entries",
                column: "status"
            );

            migrationBuilder.CreateIndex(
                name: "ix_finance_ledger_entries_status_occurred_at",
                table: "finance_ledger_entries",
                columns: new[] { "status", "occurred_at" }
            );

            migrationBuilder.CreateIndex(
                name: "ix_finance_ledger_entries_store_id",
                table: "finance_ledger_entries",
                column: "store_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_finance_ledger_entries_store_id_occurred_at",
                table: "finance_ledger_entries",
                columns: new[] { "store_id", "occurred_at" }
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "finance_ledger_entries");
        }
    }
}
