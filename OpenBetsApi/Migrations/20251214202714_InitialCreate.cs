using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace OpenBetsApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "winning_columns",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    game_id = table.Column<int>(type: "integer", nullable: false),
                    draw_id = table.Column<int>(type: "integer", nullable: false),
                    draw_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    n1 = table.Column<int>(type: "integer", nullable: false),
                    n2 = table.Column<int>(type: "integer", nullable: false),
                    n3 = table.Column<int>(type: "integer", nullable: false),
                    n4 = table.Column<int>(type: "integer", nullable: false),
                    n5 = table.Column<int>(type: "integer", nullable: false),
                    j1 = table.Column<int>(type: "integer", nullable: false),
                    winning_column_descr = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_winning_columns", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "game_draw_results",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    game_id = table.Column<int>(type: "integer", nullable: false),
                    draw_id = table.Column<int>(type: "integer", nullable: false),
                    winning_category_descr = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    successes_cnt = table.Column<int>(type: "integer", nullable: true),
                    divident_amn = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    total_payout = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    winning_column_id = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_game_draw_results", x => x.id);
                    table.ForeignKey(
                        name: "FK_game_draw_results_winning_columns_winning_column_id",
                        column: x => x.winning_column_id,
                        principalTable: "winning_columns",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "idx_game_draw_results_game_draw",
                table: "game_draw_results",
                columns: new[] { "game_id", "draw_id" });

            migrationBuilder.CreateIndex(
                name: "IX_game_draw_results_winning_column_id",
                table: "game_draw_results",
                column: "winning_column_id");

            migrationBuilder.CreateIndex(
                name: "idx_winning_columns_draw_time",
                table: "winning_columns",
                column: "draw_time");

            migrationBuilder.CreateIndex(
                name: "idx_winning_columns_game_draw",
                table: "winning_columns",
                columns: new[] { "game_id", "draw_id" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "game_draw_results");

            migrationBuilder.DropTable(
                name: "winning_columns");
        }
    }
}
