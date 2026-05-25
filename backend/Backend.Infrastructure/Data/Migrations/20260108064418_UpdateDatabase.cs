using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(name: "ix_vendors_email", table: "vendors");

            migrationBuilder.AlterColumn<string>(
                name: "phone",
                table: "vendors",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20,
                oldNullable: true
            );

            migrationBuilder.AlterColumn<string>(
                name: "email",
                table: "vendors",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255,
                oldNullable: true
            );

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "sneakers",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255,
                oldNullable: true
            );

            migrationBuilder.AlterColumn<string>(
                name: "hex",
                table: "colors",
                type: "character varying(7)",
                maxLength: 7,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(7)",
                oldMaxLength: 7,
                oldNullable: true
            );

            migrationBuilder.AlterColumn<string>(
                name: "logo_url",
                table: "brands",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500,
                oldNullable: true
            );

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "brand_series",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255,
                oldNullable: true
            );

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "brand_category_accessories",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255,
                oldNullable: true
            );

            migrationBuilder.AlterColumn<string>(
                name: "phone",
                table: "accounts",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20,
                oldNullable: true
            );

            migrationBuilder.AlterColumn<string>(
                name: "slug",
                table: "accessories",
                type: "character varying(300)",
                maxLength: 300,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(300)",
                oldMaxLength: 300,
                oldNullable: true
            );

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "accessories",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255,
                oldNullable: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_vendors_email",
                table: "vendors",
                column: "email",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_vendors_phone",
                table: "vendors",
                column: "phone",
                unique: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(name: "ix_vendors_email", table: "vendors");

            migrationBuilder.DropIndex(name: "ix_vendors_phone", table: "vendors");

            migrationBuilder.AlterColumn<string>(
                name: "phone",
                table: "vendors",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20
            );

            migrationBuilder.AlterColumn<string>(
                name: "email",
                table: "vendors",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255
            );

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "sneakers",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255
            );

            migrationBuilder.AlterColumn<string>(
                name: "hex",
                table: "colors",
                type: "character varying(7)",
                maxLength: 7,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(7)",
                oldMaxLength: 7
            );

            migrationBuilder.AlterColumn<string>(
                name: "logo_url",
                table: "brands",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500
            );

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "brand_series",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255
            );

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "brand_category_accessories",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255
            );

            migrationBuilder.AlterColumn<string>(
                name: "phone",
                table: "accounts",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20
            );

            migrationBuilder.AlterColumn<string>(
                name: "slug",
                table: "accessories",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(300)",
                oldMaxLength: 300
            );

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "accessories",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255
            );

            migrationBuilder.CreateIndex(
                name: "ix_vendors_email",
                table: "vendors",
                column: "email"
            );
        }
    }
}
