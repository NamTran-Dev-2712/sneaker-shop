using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Backend.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "accounts",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    role = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: false
                    ),
                    email = table.Column<string>(
                        type: "character varying(255)",
                        maxLength: 255,
                        nullable: true
                    ),
                    is_email_verified = table.Column<bool>(
                        type: "boolean",
                        nullable: false,
                        defaultValue: false
                    ),
                    phone = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: true
                    ),
                    password = table.Column<string>(
                        type: "character varying(500)",
                        maxLength: 500,
                        nullable: true
                    ),
                    avatar = table.Column<string>(
                        type: "character varying(500)",
                        maxLength: 500,
                        nullable: true
                    ),
                    is_active = table.Column<bool>(
                        type: "boolean",
                        nullable: false,
                        defaultValue: true
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
                    table.PrimaryKey("pk_accounts", x => x.id);
                }
            );

            migrationBuilder.CreateTable(
                name: "brands",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    name = table.Column<string>(
                        type: "character varying(255)",
                        maxLength: 255,
                        nullable: false
                    ),
                    slug = table.Column<string>(
                        type: "character varying(300)",
                        maxLength: 300,
                        nullable: false
                    ),
                    logo_url = table.Column<string>(
                        type: "character varying(500)",
                        maxLength: 500,
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
                    table.PrimaryKey("pk_brands", x => x.id);
                }
            );

            migrationBuilder.CreateTable(
                name: "category_accessories",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    name = table.Column<string>(
                        type: "character varying(255)",
                        maxLength: 255,
                        nullable: false
                    ),
                    slug = table.Column<string>(
                        type: "character varying(300)",
                        maxLength: 300,
                        nullable: false
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
                    table.PrimaryKey("pk_category_accessories", x => x.id);
                }
            );

            migrationBuilder.CreateTable(
                name: "colors",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    name = table.Column<string>(
                        type: "character varying(100)",
                        maxLength: 100,
                        nullable: false
                    ),
                    slug = table.Column<string>(
                        type: "character varying(150)",
                        maxLength: 150,
                        nullable: false
                    ),
                    hex = table.Column<string>(
                        type: "character varying(7)",
                        maxLength: 7,
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
                    table.PrimaryKey("pk_colors", x => x.id);
                }
            );

            migrationBuilder.CreateTable(
                name: "customers",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    phone = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: false
                    ),
                    email = table.Column<string>(
                        type: "character varying(255)",
                        maxLength: 255,
                        nullable: true
                    ),
                    full_name = table.Column<string>(
                        type: "character varying(255)",
                        maxLength: 255,
                        nullable: true
                    ),
                    birthday = table.Column<string>(
                        type: "character varying(50)",
                        maxLength: 50,
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
                    table.PrimaryKey("pk_customers", x => x.id);
                }
            );

            migrationBuilder.CreateTable(
                name: "sizes",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    system = table.Column<string>(
                        type: "character varying(10)",
                        maxLength: 10,
                        nullable: false
                    ),
                    value = table.Column<decimal>(
                        type: "numeric(5,2)",
                        precision: 5,
                        scale: 2,
                        nullable: false
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
                    table.PrimaryKey("pk_sizes", x => x.id);
                }
            );

            migrationBuilder.CreateTable(
                name: "stores",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    code = table.Column<string>(
                        type: "character varying(50)",
                        maxLength: 50,
                        nullable: false
                    ),
                    name = table.Column<string>(
                        type: "character varying(255)",
                        maxLength: 255,
                        nullable: false
                    ),
                    address = table.Column<string>(
                        type: "character varying(500)",
                        maxLength: 500,
                        nullable: true
                    ),
                    phone = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: true
                    ),
                    is_active = table.Column<bool>(
                        type: "boolean",
                        nullable: false,
                        defaultValue: true
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
                    table.PrimaryKey("pk_stores", x => x.id);
                }
            );

            migrationBuilder.CreateTable(
                name: "vendors",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    name = table.Column<string>(
                        type: "character varying(255)",
                        maxLength: 255,
                        nullable: false
                    ),
                    phone = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: true
                    ),
                    email = table.Column<string>(
                        type: "character varying(255)",
                        maxLength: 255,
                        nullable: true
                    ),
                    address = table.Column<string>(
                        type: "character varying(500)",
                        maxLength: 500,
                        nullable: true
                    ),
                    is_active = table.Column<bool>(
                        type: "boolean",
                        nullable: false,
                        defaultValue: true
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
                    table.PrimaryKey("pk_vendors", x => x.id);
                }
            );

            migrationBuilder.CreateTable(
                name: "vouchers",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    code = table.Column<string>(
                        type: "character varying(50)",
                        maxLength: 50,
                        nullable: false
                    ),
                    discount_type = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: false
                    ),
                    discount_value = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false
                    ),
                    max_discount = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: true
                    ),
                    min_order_total = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: true
                    ),
                    scope = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: false
                    ),
                    usage_limit = table.Column<int>(type: "integer", nullable: true),
                    usage_per_customer = table.Column<int>(type: "integer", nullable: true),
                    starts_at = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: true
                    ),
                    ends_at = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: true
                    ),
                    is_active = table.Column<bool>(
                        type: "boolean",
                        nullable: false,
                        defaultValue: true
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
                    table.PrimaryKey("pk_vouchers", x => x.id);
                }
            );

            migrationBuilder.CreateTable(
                name: "admin_profiles",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    account_id = table.Column<int>(type: "integer", nullable: false),
                    full_name = table.Column<string>(
                        type: "character varying(255)",
                        maxLength: 255,
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
                    table.PrimaryKey("pk_admin_profiles", x => x.id);
                    table.ForeignKey(
                        name: "fk_admin_profiles_accounts_account_id",
                        column: x => x.account_id,
                        principalTable: "accounts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "brand_series",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    brand_id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(
                        type: "character varying(255)",
                        maxLength: 255,
                        nullable: true
                    ),
                    slug = table.Column<string>(
                        type: "character varying(300)",
                        maxLength: 300,
                        nullable: false
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
                    table.PrimaryKey("pk_brand_series", x => x.id);
                    table.ForeignKey(
                        name: "fk_brand_series_brands_brand_id",
                        column: x => x.brand_id,
                        principalTable: "brands",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "brand_category_accessories",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    category_id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(
                        type: "character varying(255)",
                        maxLength: 255,
                        nullable: true
                    ),
                    slug = table.Column<string>(
                        type: "character varying(300)",
                        maxLength: 300,
                        nullable: false
                    ),
                    thumbnail_url = table.Column<string>(
                        type: "character varying(500)",
                        maxLength: 500,
                        nullable: false
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
                    table.PrimaryKey("pk_brand_category_accessories", x => x.id);
                    table.ForeignKey(
                        name: "fk_brand_category_accessories_category_accessories_category_id",
                        column: x => x.category_id,
                        principalTable: "category_accessories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "carts",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    customer_id = table.Column<int>(type: "integer", nullable: false),
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
                    table.PrimaryKey("pk_carts", x => x.id);
                    table.ForeignKey(
                        name: "fk_carts_customers_customer_id",
                        column: x => x.customer_id,
                        principalTable: "customers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "customer_accounts",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    account_id = table.Column<int>(type: "integer", nullable: false),
                    customer_id = table.Column<int>(type: "integer", nullable: false),
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
                    table.PrimaryKey("pk_customer_accounts", x => x.id);
                    table.ForeignKey(
                        name: "fk_customer_accounts_accounts_account_id",
                        column: x => x.account_id,
                        principalTable: "accounts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "fk_customer_accounts_customers_customer_id",
                        column: x => x.customer_id,
                        principalTable: "customers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "loyalty_accounts",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    customer_id = table.Column<int>(type: "integer", nullable: false),
                    points_balance = table.Column<long>(
                        type: "bigint",
                        nullable: false,
                        defaultValue: 0L
                    ),
                    tier = table.Column<string>(
                        type: "character varying(50)",
                        maxLength: 50,
                        nullable: false,
                        defaultValue: "STANDARD"
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
                    table.PrimaryKey("pk_loyalty_accounts", x => x.id);
                    table.ForeignKey(
                        name: "fk_loyalty_accounts_customers_customer_id",
                        column: x => x.customer_id,
                        principalTable: "customers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "orders",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    channel = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: false
                    ),
                    status = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: false
                    ),
                    store_id = table.Column<int>(type: "integer", nullable: true),
                    customer_id = table.Column<int>(type: "integer", nullable: true),
                    created_by = table.Column<int>(type: "integer", nullable: true),
                    staff_id = table.Column<int>(type: "integer", nullable: true),
                    subtotal = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false,
                        defaultValue: 0m
                    ),
                    discount_total = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false,
                        defaultValue: 0m
                    ),
                    shipping_fee = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false,
                        defaultValue: 0m
                    ),
                    total = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false,
                        defaultValue: 0m
                    ),
                    redeemed_points = table.Column<long>(
                        type: "bigint",
                        nullable: false,
                        defaultValue: 0L
                    ),
                    redeemed_amount = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false,
                        defaultValue: 0m
                    ),
                    note = table.Column<string>(
                        type: "character varying(1000)",
                        maxLength: 1000,
                        nullable: true
                    ),
                    placed_at = table.Column<DateTime>(
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
                    table.PrimaryKey("pk_orders", x => x.id);
                    table.ForeignKey(
                        name: "fk_orders_accounts_created_by",
                        column: x => x.created_by,
                        principalTable: "accounts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull
                    );
                    table.ForeignKey(
                        name: "fk_orders_accounts_staff_id",
                        column: x => x.staff_id,
                        principalTable: "accounts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull
                    );
                    table.ForeignKey(
                        name: "fk_orders_customers_customer_id",
                        column: x => x.customer_id,
                        principalTable: "customers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull
                    );
                    table.ForeignKey(
                        name: "fk_orders_stores_store_id",
                        column: x => x.store_id,
                        principalTable: "stores",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "staff_profiles",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    account_id = table.Column<int>(type: "integer", nullable: false),
                    store_id = table.Column<int>(type: "integer", nullable: false),
                    full_name = table.Column<string>(
                        type: "character varying(255)",
                        maxLength: 255,
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
                    table.PrimaryKey("pk_staff_profiles", x => x.id);
                    table.ForeignKey(
                        name: "fk_staff_profiles_accounts_account_id",
                        column: x => x.account_id,
                        principalTable: "accounts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "fk_staff_profiles_stores_store_id",
                        column: x => x.store_id,
                        principalTable: "stores",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "purchase_orders",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    vendor_id = table.Column<int>(type: "integer", nullable: false),
                    store_id = table.Column<int>(type: "integer", nullable: false),
                    status = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: false
                    ),
                    expected_at = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: true
                    ),
                    note = table.Column<string>(
                        type: "character varying(1000)",
                        maxLength: 1000,
                        nullable: true
                    ),
                    created_by = table.Column<int>(type: "integer", nullable: true),
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
                    table.PrimaryKey("pk_purchase_orders", x => x.id);
                    table.ForeignKey(
                        name: "fk_purchase_orders_accounts_created_by",
                        column: x => x.created_by,
                        principalTable: "accounts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull
                    );
                    table.ForeignKey(
                        name: "fk_purchase_orders_stores_store_id",
                        column: x => x.store_id,
                        principalTable: "stores",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict
                    );
                    table.ForeignKey(
                        name: "fk_purchase_orders_vendors_vendor_id",
                        column: x => x.vendor_id,
                        principalTable: "vendors",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "sneakers",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    brand_id = table.Column<int>(type: "integer", nullable: false),
                    brand_series_id = table.Column<int>(type: "integer", nullable: true),
                    name = table.Column<string>(
                        type: "character varying(255)",
                        maxLength: 255,
                        nullable: true
                    ),
                    slug = table.Column<string>(
                        type: "character varying(300)",
                        maxLength: 300,
                        nullable: false
                    ),
                    description = table.Column<string>(
                        type: "character varying(2000)",
                        maxLength: 2000,
                        nullable: true
                    ),
                    main_image = table.Column<string>(
                        type: "character varying(500)",
                        maxLength: 500,
                        nullable: false
                    ),
                    base_price = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: true
                    ),
                    is_active = table.Column<bool>(
                        type: "boolean",
                        nullable: false,
                        defaultValue: true
                    ),
                    is_deleted = table.Column<bool>(
                        type: "boolean",
                        nullable: false,
                        defaultValue: false
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
                    table.PrimaryKey("pk_sneakers", x => x.id);
                    table.ForeignKey(
                        name: "fk_sneakers_brand_series_brand_series_id",
                        column: x => x.brand_series_id,
                        principalTable: "brand_series",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull
                    );
                    table.ForeignKey(
                        name: "fk_sneakers_brands_brand_id",
                        column: x => x.brand_id,
                        principalTable: "brands",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "accessories",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    category_id = table.Column<int>(type: "integer", nullable: false),
                    brand_id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(
                        type: "character varying(255)",
                        maxLength: 255,
                        nullable: true
                    ),
                    slug = table.Column<string>(
                        type: "character varying(300)",
                        maxLength: 300,
                        nullable: true
                    ),
                    description = table.Column<string>(
                        type: "character varying(2000)",
                        maxLength: 2000,
                        nullable: true
                    ),
                    main_image = table.Column<string>(
                        type: "character varying(500)",
                        maxLength: 500,
                        nullable: false
                    ),
                    base_price = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: true
                    ),
                    is_deleted = table.Column<bool>(
                        type: "boolean",
                        nullable: false,
                        defaultValue: false
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
                    table.PrimaryKey("pk_accessories", x => x.id);
                    table.ForeignKey(
                        name: "fk_accessories_brand_category_accessories_brand_id",
                        column: x => x.brand_id,
                        principalTable: "brand_category_accessories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict
                    );
                    table.ForeignKey(
                        name: "fk_accessories_category_accessories_category_id",
                        column: x => x.category_id,
                        principalTable: "category_accessories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "loyalty_transactions",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    loyalty_account_id = table.Column<int>(type: "integer", nullable: false),
                    txn_type = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: false
                    ),
                    points = table.Column<long>(type: "bigint", nullable: false),
                    reason = table.Column<string>(
                        type: "character varying(500)",
                        maxLength: 500,
                        nullable: true
                    ),
                    order_id = table.Column<int>(type: "integer", nullable: true),
                    created_by = table.Column<int>(type: "integer", nullable: true),
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
                    table.PrimaryKey("pk_loyalty_transactions", x => x.id);
                    table.ForeignKey(
                        name: "fk_loyalty_transactions_accounts_created_by",
                        column: x => x.created_by,
                        principalTable: "accounts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull
                    );
                    table.ForeignKey(
                        name: "fk_loyalty_transactions_loyalty_accounts_loyalty_account_id",
                        column: x => x.loyalty_account_id,
                        principalTable: "loyalty_accounts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "fk_loyalty_transactions_orders_order_id",
                        column: x => x.order_id,
                        principalTable: "orders",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "order_fulfillments",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    order_id = table.Column<int>(type: "integer", nullable: false),
                    type = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: false
                    ),
                    pickup_store_id = table.Column<int>(type: "integer", nullable: true),
                    pickup_expires_at = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: true
                    ),
                    recipient_name = table.Column<string>(
                        type: "character varying(255)",
                        maxLength: 255,
                        nullable: true
                    ),
                    recipient_phone = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: true
                    ),
                    address = table.Column<string>(
                        type: "character varying(1000)",
                        maxLength: 1000,
                        nullable: true
                    ),
                    carrier = table.Column<string>(
                        type: "character varying(100)",
                        maxLength: 100,
                        nullable: true
                    ),
                    tracking_code = table.Column<string>(
                        type: "character varying(100)",
                        maxLength: 100,
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
                    table.PrimaryKey("pk_order_fulfillments", x => x.id);
                    table.ForeignKey(
                        name: "fk_order_fulfillments_orders_order_id",
                        column: x => x.order_id,
                        principalTable: "orders",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "fk_order_fulfillments_stores_pickup_store_id",
                        column: x => x.pickup_store_id,
                        principalTable: "stores",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "payments",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    order_id = table.Column<int>(type: "integer", nullable: false),
                    method = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: false
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
                    provider = table.Column<string>(
                        type: "character varying(100)",
                        maxLength: 100,
                        nullable: true
                    ),
                    provider_txn_id = table.Column<string>(
                        type: "character varying(255)",
                        maxLength: 255,
                        nullable: true
                    ),
                    paid_at = table.Column<DateTime>(
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
                    table.PrimaryKey("pk_payments", x => x.id);
                    table.ForeignKey(
                        name: "fk_payments_orders_order_id",
                        column: x => x.order_id,
                        principalTable: "orders",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "returns",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    order_id = table.Column<int>(type: "integer", nullable: false),
                    store_id = table.Column<int>(type: "integer", nullable: true),
                    status = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: false
                    ),
                    reason = table.Column<string>(
                        type: "character varying(1000)",
                        maxLength: 1000,
                        nullable: true
                    ),
                    created_by = table.Column<int>(type: "integer", nullable: true),
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
                    table.PrimaryKey("pk_returns", x => x.id);
                    table.ForeignKey(
                        name: "fk_returns_accounts_created_by",
                        column: x => x.created_by,
                        principalTable: "accounts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull
                    );
                    table.ForeignKey(
                        name: "fk_returns_orders_order_id",
                        column: x => x.order_id,
                        principalTable: "orders",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict
                    );
                    table.ForeignKey(
                        name: "fk_returns_stores_store_id",
                        column: x => x.store_id,
                        principalTable: "stores",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "voucher_redemptions",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    voucher_id = table.Column<int>(type: "integer", nullable: false),
                    order_id = table.Column<int>(type: "integer", nullable: false),
                    customer_id = table.Column<int>(type: "integer", nullable: true),
                    redeemed_at = table.Column<DateTime>(
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
                    table.PrimaryKey("pk_voucher_redemptions", x => x.id);
                    table.ForeignKey(
                        name: "fk_voucher_redemptions_customers_customer_id",
                        column: x => x.customer_id,
                        principalTable: "customers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull
                    );
                    table.ForeignKey(
                        name: "fk_voucher_redemptions_orders_order_id",
                        column: x => x.order_id,
                        principalTable: "orders",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "fk_voucher_redemptions_vouchers_voucher_id",
                        column: x => x.voucher_id,
                        principalTable: "vouchers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "sneaker_colorways",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    sneaker_id = table.Column<int>(type: "integer", nullable: false),
                    color_id = table.Column<int>(type: "integer", nullable: false),
                    cover_image = table.Column<string>(
                        type: "character varying(500)",
                        maxLength: 500,
                        nullable: false
                    ),
                    is_active = table.Column<bool>(
                        type: "boolean",
                        nullable: false,
                        defaultValue: true
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
                    table.PrimaryKey("pk_sneaker_colorways", x => x.id);
                    table.ForeignKey(
                        name: "fk_sneaker_colorways_colors_color_id",
                        column: x => x.color_id,
                        principalTable: "colors",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict
                    );
                    table.ForeignKey(
                        name: "fk_sneaker_colorways_sneakers_sneaker_id",
                        column: x => x.sneaker_id,
                        principalTable: "sneakers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "accessory_images",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    accessory_id = table.Column<int>(type: "integer", nullable: false),
                    image_url = table.Column<string>(
                        type: "character varying(500)",
                        maxLength: 500,
                        nullable: false
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
                    table.PrimaryKey("pk_accessory_images", x => x.id);
                    table.ForeignKey(
                        name: "fk_accessory_images_accessories_accessory_id",
                        column: x => x.accessory_id,
                        principalTable: "accessories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "sneaker_variants",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    sneaker_id = table.Column<int>(type: "integer", nullable: false),
                    colorway_id = table.Column<int>(type: "integer", nullable: false),
                    size_id = table.Column<int>(type: "integer", nullable: false),
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
                    table.PrimaryKey("pk_sneaker_variants", x => x.id);
                    table.ForeignKey(
                        name: "fk_sneaker_variants_sizes_size_id",
                        column: x => x.size_id,
                        principalTable: "sizes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict
                    );
                    table.ForeignKey(
                        name: "fk_sneaker_variants_sneaker_colorways_colorway_id",
                        column: x => x.colorway_id,
                        principalTable: "sneaker_colorways",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "fk_sneaker_variants_sneakers_sneaker_id",
                        column: x => x.sneaker_id,
                        principalTable: "sneakers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "sellable_items",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    type = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: false
                    ),
                    sneaker_variant_id = table.Column<int>(type: "integer", nullable: true),
                    accessory_id = table.Column<int>(type: "integer", nullable: true),
                    sku = table.Column<string>(
                        type: "character varying(100)",
                        maxLength: 100,
                        nullable: false
                    ),
                    barcode = table.Column<string>(
                        type: "character varying(100)",
                        maxLength: 100,
                        nullable: true
                    ),
                    retail_price = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: true
                    ),
                    online_price = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: true
                    ),
                    is_active = table.Column<bool>(
                        type: "boolean",
                        nullable: false,
                        defaultValue: true
                    ),
                    row_version = table.Column<byte[]>(
                        type: "bytea",
                        rowVersion: true,
                        nullable: false
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
                    table.PrimaryKey("pk_sellable_items", x => x.id);
                    table.ForeignKey(
                        name: "fk_sellable_items_accessories_accessory_id",
                        column: x => x.accessory_id,
                        principalTable: "accessories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "fk_sellable_items_sneaker_variants_sneaker_variant_id",
                        column: x => x.sneaker_variant_id,
                        principalTable: "sneaker_variants",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "cart_items",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    cart_id = table.Column<int>(type: "integer", nullable: false),
                    sellable_item_id = table.Column<int>(type: "integer", nullable: false),
                    quantity = table.Column<int>(type: "integer", nullable: false),
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
                    table.PrimaryKey("pk_cart_items", x => x.id);
                    table.ForeignKey(
                        name: "fk_cart_items_carts_cart_id",
                        column: x => x.cart_id,
                        principalTable: "carts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "fk_cart_items_sellable_items_sellable_item_id",
                        column: x => x.sellable_item_id,
                        principalTable: "sellable_items",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "inventories",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    sellable_item_id = table.Column<int>(type: "integer", nullable: false),
                    store_id = table.Column<int>(type: "integer", nullable: false),
                    on_hand = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    reserved = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    row_version = table.Column<byte[]>(
                        type: "bytea",
                        rowVersion: true,
                        nullable: false
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
                    table.PrimaryKey("pk_inventories", x => x.id);
                    table.ForeignKey(
                        name: "fk_inventories_sellable_items_sellable_item_id",
                        column: x => x.sellable_item_id,
                        principalTable: "sellable_items",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict
                    );
                    table.ForeignKey(
                        name: "fk_inventories_stores_store_id",
                        column: x => x.store_id,
                        principalTable: "stores",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "order_items",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    order_id = table.Column<int>(type: "integer", nullable: false),
                    sellable_item_id = table.Column<int>(type: "integer", nullable: false),
                    quantity = table.Column<int>(type: "integer", nullable: false),
                    unit_price = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false
                    ),
                    discount = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false,
                        defaultValue: 0m
                    ),
                    line_total = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false
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
                    table.PrimaryKey("pk_order_items", x => x.id);
                    table.ForeignKey(
                        name: "fk_order_items_orders_order_id",
                        column: x => x.order_id,
                        principalTable: "orders",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "fk_order_items_sellable_items_sellable_item_id",
                        column: x => x.sellable_item_id,
                        principalTable: "sellable_items",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "purchase_order_items",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    purchase_order_id = table.Column<int>(type: "integer", nullable: false),
                    sellable_item_id = table.Column<int>(type: "integer", nullable: false),
                    quantity = table.Column<int>(type: "integer", nullable: false),
                    unit_cost = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false
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
                    table.PrimaryKey("pk_purchase_order_items", x => x.id);
                    table.ForeignKey(
                        name: "fk_purchase_order_items_purchase_orders_purchase_order_id",
                        column: x => x.purchase_order_id,
                        principalTable: "purchase_orders",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "fk_purchase_order_items_sellable_items_sellable_item_id",
                        column: x => x.sellable_item_id,
                        principalTable: "sellable_items",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "restock_requests",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    store_id = table.Column<int>(type: "integer", nullable: false),
                    sellable_item_id = table.Column<int>(type: "integer", nullable: false),
                    suggested_qty = table.Column<int>(type: "integer", nullable: false),
                    reason = table.Column<string>(
                        type: "character varying(1000)",
                        maxLength: 1000,
                        nullable: true
                    ),
                    status = table.Column<string>(
                        type: "character varying(20)",
                        maxLength: 20,
                        nullable: false
                    ),
                    created_by = table.Column<int>(type: "integer", nullable: true),
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
                    table.PrimaryKey("pk_restock_requests", x => x.id);
                    table.ForeignKey(
                        name: "fk_restock_requests_accounts_created_by",
                        column: x => x.created_by,
                        principalTable: "accounts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull
                    );
                    table.ForeignKey(
                        name: "fk_restock_requests_sellable_items_sellable_item_id",
                        column: x => x.sellable_item_id,
                        principalTable: "sellable_items",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict
                    );
                    table.ForeignKey(
                        name: "fk_restock_requests_stores_store_id",
                        column: x => x.store_id,
                        principalTable: "stores",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "return_items",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    return_id = table.Column<int>(type: "integer", nullable: false),
                    sellable_item_id = table.Column<int>(type: "integer", nullable: false),
                    quantity = table.Column<int>(type: "integer", nullable: false),
                    condition = table.Column<string>(
                        type: "character varying(50)",
                        maxLength: 50,
                        nullable: true
                    ),
                    refund_amount = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false,
                        defaultValue: 0m
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
                    table.PrimaryKey("pk_return_items", x => x.id);
                    table.ForeignKey(
                        name: "fk_return_items_returns_return_id",
                        column: x => x.return_id,
                        principalTable: "returns",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "fk_return_items_sellable_items_sellable_item_id",
                        column: x => x.sellable_item_id,
                        principalTable: "sellable_items",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "vendor_prices",
                columns: table => new
                {
                    id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    vendor_id = table.Column<int>(type: "integer", nullable: false),
                    sellable_item_id = table.Column<int>(type: "integer", nullable: false),
                    price = table.Column<decimal>(
                        type: "numeric(18,2)",
                        precision: 18,
                        scale: 2,
                        nullable: false
                    ),
                    effective_from = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    effective_to = table.Column<DateTime>(
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
                    table.PrimaryKey("pk_vendor_prices", x => x.id);
                    table.ForeignKey(
                        name: "fk_vendor_prices_sellable_items_sellable_item_id",
                        column: x => x.sellable_item_id,
                        principalTable: "sellable_items",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "fk_vendor_prices_vendors_vendor_id",
                        column: x => x.vendor_id,
                        principalTable: "vendors",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateIndex(
                name: "ix_accessories_brand_id",
                table: "accessories",
                column: "brand_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_accessories_category_id",
                table: "accessories",
                column: "category_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_accessories_is_deleted",
                table: "accessories",
                column: "is_deleted"
            );

            migrationBuilder.CreateIndex(
                name: "ix_accessories_name",
                table: "accessories",
                column: "name"
            );

            migrationBuilder.CreateIndex(
                name: "ix_accessories_slug",
                table: "accessories",
                column: "slug",
                unique: true,
                filter: "slug IS NOT NULL"
            );

            migrationBuilder.CreateIndex(
                name: "ix_accessory_images_accessory_id",
                table: "accessory_images",
                column: "accessory_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_accounts_email",
                table: "accounts",
                column: "email",
                unique: true,
                filter: "email IS NOT NULL"
            );

            migrationBuilder.CreateIndex(
                name: "ix_accounts_is_active",
                table: "accounts",
                column: "is_active"
            );

            migrationBuilder.CreateIndex(
                name: "ix_accounts_phone",
                table: "accounts",
                column: "phone",
                unique: true,
                filter: "phone IS NOT NULL"
            );

            migrationBuilder.CreateIndex(
                name: "ix_accounts_role",
                table: "accounts",
                column: "role"
            );

            migrationBuilder.CreateIndex(
                name: "ix_admin_profiles_account_id",
                table: "admin_profiles",
                column: "account_id",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_brand_category_accessories_category_id",
                table: "brand_category_accessories",
                column: "category_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_brand_category_accessories_category_id_slug",
                table: "brand_category_accessories",
                columns: new[] { "category_id", "slug" },
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_brand_category_accessories_slug",
                table: "brand_category_accessories",
                column: "slug"
            );

            migrationBuilder.CreateIndex(
                name: "ix_brand_series_brand_id",
                table: "brand_series",
                column: "brand_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_brand_series_brand_id_slug",
                table: "brand_series",
                columns: new[] { "brand_id", "slug" },
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_brand_series_slug",
                table: "brand_series",
                column: "slug"
            );

            migrationBuilder.CreateIndex(name: "ix_brands_name", table: "brands", column: "name");

            migrationBuilder.CreateIndex(
                name: "ix_brands_slug",
                table: "brands",
                column: "slug",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_cart_items_cart_id",
                table: "cart_items",
                column: "cart_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_cart_items_cart_id_sellable_item_id",
                table: "cart_items",
                columns: new[] { "cart_id", "sellable_item_id" },
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_cart_items_sellable_item_id",
                table: "cart_items",
                column: "sellable_item_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_carts_customer_id",
                table: "carts",
                column: "customer_id",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_category_accessories_name",
                table: "category_accessories",
                column: "name"
            );

            migrationBuilder.CreateIndex(
                name: "ix_category_accessories_slug",
                table: "category_accessories",
                column: "slug",
                unique: true
            );

            migrationBuilder.CreateIndex(name: "ix_colors_name", table: "colors", column: "name");

            migrationBuilder.CreateIndex(
                name: "ix_colors_slug",
                table: "colors",
                column: "slug",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_customer_accounts_account_id",
                table: "customer_accounts",
                column: "account_id",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_customer_accounts_customer_id",
                table: "customer_accounts",
                column: "customer_id",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_customers_email",
                table: "customers",
                column: "email"
            );

            migrationBuilder.CreateIndex(
                name: "ix_customers_full_name",
                table: "customers",
                column: "full_name"
            );

            migrationBuilder.CreateIndex(
                name: "ix_customers_phone",
                table: "customers",
                column: "phone",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_inventories_on_hand",
                table: "inventories",
                column: "on_hand"
            );

            migrationBuilder.CreateIndex(
                name: "ix_inventories_reserved",
                table: "inventories",
                column: "reserved"
            );

            migrationBuilder.CreateIndex(
                name: "ix_inventories_sellable_item_id",
                table: "inventories",
                column: "sellable_item_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_inventories_store_id",
                table: "inventories",
                column: "store_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_inventories_store_id_on_hand_reserved",
                table: "inventories",
                columns: new[] { "store_id", "on_hand", "reserved" }
            );

            migrationBuilder.CreateIndex(
                name: "ix_inventories_store_id_sellable_item_id",
                table: "inventories",
                columns: new[] { "store_id", "sellable_item_id" },
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_loyalty_accounts_customer_id",
                table: "loyalty_accounts",
                column: "customer_id",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_loyalty_accounts_points_balance",
                table: "loyalty_accounts",
                column: "points_balance"
            );

            migrationBuilder.CreateIndex(
                name: "ix_loyalty_accounts_tier",
                table: "loyalty_accounts",
                column: "tier"
            );

            migrationBuilder.CreateIndex(
                name: "ix_loyalty_transactions_created_at",
                table: "loyalty_transactions",
                column: "created_at"
            );

            migrationBuilder.CreateIndex(
                name: "ix_loyalty_transactions_created_by",
                table: "loyalty_transactions",
                column: "created_by"
            );

            migrationBuilder.CreateIndex(
                name: "ix_loyalty_transactions_loyalty_account_id",
                table: "loyalty_transactions",
                column: "loyalty_account_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_loyalty_transactions_loyalty_account_id_created_at",
                table: "loyalty_transactions",
                columns: new[] { "loyalty_account_id", "created_at" }
            );

            migrationBuilder.CreateIndex(
                name: "ix_loyalty_transactions_order_id",
                table: "loyalty_transactions",
                column: "order_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_loyalty_transactions_txn_type",
                table: "loyalty_transactions",
                column: "txn_type"
            );

            migrationBuilder.CreateIndex(
                name: "ix_order_fulfillments_order_id",
                table: "order_fulfillments",
                column: "order_id",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_order_fulfillments_pickup_expires_at",
                table: "order_fulfillments",
                column: "pickup_expires_at"
            );

            migrationBuilder.CreateIndex(
                name: "ix_order_fulfillments_pickup_store_id",
                table: "order_fulfillments",
                column: "pickup_store_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_order_fulfillments_tracking_code",
                table: "order_fulfillments",
                column: "tracking_code"
            );

            migrationBuilder.CreateIndex(
                name: "ix_order_fulfillments_type",
                table: "order_fulfillments",
                column: "type"
            );

            migrationBuilder.CreateIndex(
                name: "ix_order_items_order_id",
                table: "order_items",
                column: "order_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_order_items_order_id_sellable_item_id",
                table: "order_items",
                columns: new[] { "order_id", "sellable_item_id" },
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_order_items_sellable_item_id",
                table: "order_items",
                column: "sellable_item_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_orders_channel",
                table: "orders",
                column: "channel"
            );

            migrationBuilder.CreateIndex(
                name: "ix_orders_created_at",
                table: "orders",
                column: "created_at"
            );

            migrationBuilder.CreateIndex(
                name: "ix_orders_created_by",
                table: "orders",
                column: "created_by"
            );

            migrationBuilder.CreateIndex(
                name: "ix_orders_customer_id",
                table: "orders",
                column: "customer_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_orders_customer_id_status",
                table: "orders",
                columns: new[] { "customer_id", "status" }
            );

            migrationBuilder.CreateIndex(
                name: "ix_orders_placed_at",
                table: "orders",
                column: "placed_at"
            );

            migrationBuilder.CreateIndex(
                name: "ix_orders_staff_id",
                table: "orders",
                column: "staff_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_orders_status",
                table: "orders",
                column: "status"
            );

            migrationBuilder.CreateIndex(
                name: "ix_orders_status_created_at",
                table: "orders",
                columns: new[] { "status", "created_at" }
            );

            migrationBuilder.CreateIndex(
                name: "ix_orders_store_id",
                table: "orders",
                column: "store_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_orders_store_id_status",
                table: "orders",
                columns: new[] { "store_id", "status" }
            );

            migrationBuilder.CreateIndex(
                name: "ix_payments_method",
                table: "payments",
                column: "method"
            );

            migrationBuilder.CreateIndex(
                name: "ix_payments_order_id",
                table: "payments",
                column: "order_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_payments_paid_at",
                table: "payments",
                column: "paid_at"
            );

            migrationBuilder.CreateIndex(
                name: "ix_payments_provider_txn_id",
                table: "payments",
                column: "provider_txn_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_payments_status",
                table: "payments",
                column: "status"
            );

            migrationBuilder.CreateIndex(
                name: "ix_payments_status_paid_at",
                table: "payments",
                columns: new[] { "status", "paid_at" }
            );

            migrationBuilder.CreateIndex(
                name: "ix_purchase_order_items_purchase_order_id",
                table: "purchase_order_items",
                column: "purchase_order_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_purchase_order_items_purchase_order_id_sellable_item_id",
                table: "purchase_order_items",
                columns: new[] { "purchase_order_id", "sellable_item_id" },
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_purchase_order_items_sellable_item_id",
                table: "purchase_order_items",
                column: "sellable_item_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_purchase_orders_created_at",
                table: "purchase_orders",
                column: "created_at"
            );

            migrationBuilder.CreateIndex(
                name: "ix_purchase_orders_created_by",
                table: "purchase_orders",
                column: "created_by"
            );

            migrationBuilder.CreateIndex(
                name: "ix_purchase_orders_expected_at",
                table: "purchase_orders",
                column: "expected_at"
            );

            migrationBuilder.CreateIndex(
                name: "ix_purchase_orders_status",
                table: "purchase_orders",
                column: "status"
            );

            migrationBuilder.CreateIndex(
                name: "ix_purchase_orders_status_created_at",
                table: "purchase_orders",
                columns: new[] { "status", "created_at" }
            );

            migrationBuilder.CreateIndex(
                name: "ix_purchase_orders_store_id",
                table: "purchase_orders",
                column: "store_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_purchase_orders_store_id_status",
                table: "purchase_orders",
                columns: new[] { "store_id", "status" }
            );

            migrationBuilder.CreateIndex(
                name: "ix_purchase_orders_vendor_id",
                table: "purchase_orders",
                column: "vendor_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_restock_requests_created_at",
                table: "restock_requests",
                column: "created_at"
            );

            migrationBuilder.CreateIndex(
                name: "ix_restock_requests_created_by",
                table: "restock_requests",
                column: "created_by"
            );

            migrationBuilder.CreateIndex(
                name: "ix_restock_requests_sellable_item_id",
                table: "restock_requests",
                column: "sellable_item_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_restock_requests_status",
                table: "restock_requests",
                column: "status"
            );

            migrationBuilder.CreateIndex(
                name: "ix_restock_requests_status_created_at",
                table: "restock_requests",
                columns: new[] { "status", "created_at" }
            );

            migrationBuilder.CreateIndex(
                name: "ix_restock_requests_store_id",
                table: "restock_requests",
                column: "store_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_restock_requests_store_id_status",
                table: "restock_requests",
                columns: new[] { "store_id", "status" }
            );

            migrationBuilder.CreateIndex(
                name: "ix_return_items_return_id",
                table: "return_items",
                column: "return_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_return_items_sellable_item_id",
                table: "return_items",
                column: "sellable_item_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_returns_created_at",
                table: "returns",
                column: "created_at"
            );

            migrationBuilder.CreateIndex(
                name: "ix_returns_created_by",
                table: "returns",
                column: "created_by"
            );

            migrationBuilder.CreateIndex(
                name: "ix_returns_order_id",
                table: "returns",
                column: "order_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_returns_status",
                table: "returns",
                column: "status"
            );

            migrationBuilder.CreateIndex(
                name: "ix_returns_status_created_at",
                table: "returns",
                columns: new[] { "status", "created_at" }
            );

            migrationBuilder.CreateIndex(
                name: "ix_returns_store_id",
                table: "returns",
                column: "store_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_sellable_items_accessory_id",
                table: "sellable_items",
                column: "accessory_id",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_sellable_items_barcode",
                table: "sellable_items",
                column: "barcode",
                unique: true,
                filter: "barcode IS NOT NULL"
            );

            migrationBuilder.CreateIndex(
                name: "ix_sellable_items_is_active",
                table: "sellable_items",
                column: "is_active"
            );

            migrationBuilder.CreateIndex(
                name: "ix_sellable_items_sku",
                table: "sellable_items",
                column: "sku",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_sellable_items_sneaker_variant_id",
                table: "sellable_items",
                column: "sneaker_variant_id",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_sellable_items_type",
                table: "sellable_items",
                column: "type"
            );

            migrationBuilder.CreateIndex(name: "ix_sizes_system", table: "sizes", column: "system");

            migrationBuilder.CreateIndex(
                name: "ix_sizes_system_value",
                table: "sizes",
                columns: new[] { "system", "value" },
                unique: true
            );

            migrationBuilder.CreateIndex(name: "ix_sizes_value", table: "sizes", column: "value");

            migrationBuilder.CreateIndex(
                name: "ix_sneaker_colorways_color_id",
                table: "sneaker_colorways",
                column: "color_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_sneaker_colorways_is_active",
                table: "sneaker_colorways",
                column: "is_active"
            );

            migrationBuilder.CreateIndex(
                name: "ix_sneaker_colorways_sneaker_id",
                table: "sneaker_colorways",
                column: "sneaker_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_sneaker_colorways_sneaker_id_color_id",
                table: "sneaker_colorways",
                columns: new[] { "sneaker_id", "color_id" },
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_sneaker_variants_colorway_id",
                table: "sneaker_variants",
                column: "colorway_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_sneaker_variants_size_id",
                table: "sneaker_variants",
                column: "size_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_sneaker_variants_sneaker_id",
                table: "sneaker_variants",
                column: "sneaker_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_sneaker_variants_sneaker_id_colorway_id_size_id",
                table: "sneaker_variants",
                columns: new[] { "sneaker_id", "colorway_id", "size_id" },
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_sneakers_brand_id",
                table: "sneakers",
                column: "brand_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_sneakers_brand_series_id",
                table: "sneakers",
                column: "brand_series_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_sneakers_is_active",
                table: "sneakers",
                column: "is_active"
            );

            migrationBuilder.CreateIndex(
                name: "ix_sneakers_is_active_is_deleted",
                table: "sneakers",
                columns: new[] { "is_active", "is_deleted" }
            );

            migrationBuilder.CreateIndex(
                name: "ix_sneakers_is_deleted",
                table: "sneakers",
                column: "is_deleted"
            );

            migrationBuilder.CreateIndex(
                name: "ix_sneakers_name",
                table: "sneakers",
                column: "name"
            );

            migrationBuilder.CreateIndex(
                name: "ix_sneakers_slug",
                table: "sneakers",
                column: "slug",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_staff_profiles_account_id",
                table: "staff_profiles",
                column: "account_id",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_staff_profiles_full_name",
                table: "staff_profiles",
                column: "full_name"
            );

            migrationBuilder.CreateIndex(
                name: "ix_staff_profiles_store_id",
                table: "staff_profiles",
                column: "store_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_stores_code",
                table: "stores",
                column: "code",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_stores_is_active",
                table: "stores",
                column: "is_active"
            );

            migrationBuilder.CreateIndex(name: "ix_stores_name", table: "stores", column: "name");

            migrationBuilder.CreateIndex(
                name: "ix_vendor_prices_effective_from",
                table: "vendor_prices",
                column: "effective_from"
            );

            migrationBuilder.CreateIndex(
                name: "ix_vendor_prices_effective_to",
                table: "vendor_prices",
                column: "effective_to"
            );

            migrationBuilder.CreateIndex(
                name: "ix_vendor_prices_sellable_item_id",
                table: "vendor_prices",
                column: "sellable_item_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_vendor_prices_vendor_id",
                table: "vendor_prices",
                column: "vendor_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_vendor_prices_vendor_id_sellable_item_id_effective_from",
                table: "vendor_prices",
                columns: new[] { "vendor_id", "sellable_item_id", "effective_from" },
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_vendor_prices_vendor_id_sellable_item_id_effective_from_eff",
                table: "vendor_prices",
                columns: new[] { "vendor_id", "sellable_item_id", "effective_from", "effective_to" }
            );

            migrationBuilder.CreateIndex(
                name: "ix_vendors_email",
                table: "vendors",
                column: "email"
            );

            migrationBuilder.CreateIndex(
                name: "ix_vendors_is_active",
                table: "vendors",
                column: "is_active"
            );

            migrationBuilder.CreateIndex(name: "ix_vendors_name", table: "vendors", column: "name");

            migrationBuilder.CreateIndex(
                name: "ix_voucher_redemptions_customer_id",
                table: "voucher_redemptions",
                column: "customer_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_voucher_redemptions_order_id",
                table: "voucher_redemptions",
                column: "order_id",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_voucher_redemptions_redeemed_at",
                table: "voucher_redemptions",
                column: "redeemed_at"
            );

            migrationBuilder.CreateIndex(
                name: "ix_voucher_redemptions_voucher_id",
                table: "voucher_redemptions",
                column: "voucher_id"
            );

            migrationBuilder.CreateIndex(
                name: "ix_voucher_redemptions_voucher_id_customer_id",
                table: "voucher_redemptions",
                columns: new[] { "voucher_id", "customer_id" }
            );

            migrationBuilder.CreateIndex(
                name: "ix_vouchers_code",
                table: "vouchers",
                column: "code",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "ix_vouchers_ends_at",
                table: "vouchers",
                column: "ends_at"
            );

            migrationBuilder.CreateIndex(
                name: "ix_vouchers_is_active",
                table: "vouchers",
                column: "is_active"
            );

            migrationBuilder.CreateIndex(
                name: "ix_vouchers_is_active_starts_at_ends_at",
                table: "vouchers",
                columns: new[] { "is_active", "starts_at", "ends_at" }
            );

            migrationBuilder.CreateIndex(
                name: "ix_vouchers_scope",
                table: "vouchers",
                column: "scope"
            );

            migrationBuilder.CreateIndex(
                name: "ix_vouchers_starts_at",
                table: "vouchers",
                column: "starts_at"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "accessory_images");

            migrationBuilder.DropTable(name: "admin_profiles");

            migrationBuilder.DropTable(name: "cart_items");

            migrationBuilder.DropTable(name: "customer_accounts");

            migrationBuilder.DropTable(name: "inventories");

            migrationBuilder.DropTable(name: "loyalty_transactions");

            migrationBuilder.DropTable(name: "order_fulfillments");

            migrationBuilder.DropTable(name: "order_items");

            migrationBuilder.DropTable(name: "payments");

            migrationBuilder.DropTable(name: "purchase_order_items");

            migrationBuilder.DropTable(name: "restock_requests");

            migrationBuilder.DropTable(name: "return_items");

            migrationBuilder.DropTable(name: "staff_profiles");

            migrationBuilder.DropTable(name: "vendor_prices");

            migrationBuilder.DropTable(name: "voucher_redemptions");

            migrationBuilder.DropTable(name: "carts");

            migrationBuilder.DropTable(name: "loyalty_accounts");

            migrationBuilder.DropTable(name: "purchase_orders");

            migrationBuilder.DropTable(name: "returns");

            migrationBuilder.DropTable(name: "sellable_items");

            migrationBuilder.DropTable(name: "vouchers");

            migrationBuilder.DropTable(name: "vendors");

            migrationBuilder.DropTable(name: "orders");

            migrationBuilder.DropTable(name: "accessories");

            migrationBuilder.DropTable(name: "sneaker_variants");

            migrationBuilder.DropTable(name: "accounts");

            migrationBuilder.DropTable(name: "customers");

            migrationBuilder.DropTable(name: "stores");

            migrationBuilder.DropTable(name: "brand_category_accessories");

            migrationBuilder.DropTable(name: "sizes");

            migrationBuilder.DropTable(name: "sneaker_colorways");

            migrationBuilder.DropTable(name: "category_accessories");

            migrationBuilder.DropTable(name: "colors");

            migrationBuilder.DropTable(name: "sneakers");

            migrationBuilder.DropTable(name: "brand_series");

            migrationBuilder.DropTable(name: "brands");
        }
    }
}
