using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DepartamentoPessoal.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddPortalColaborador : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ColaboradorId",
                table: "Usuarios",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "MensagensRH",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ColaboradorId = table.Column<int>(type: "int", nullable: false),
                    Assunto = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Mensagem = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    Resposta = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CriadoEm = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RespondidoEm = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MensagensRH", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MensagensRH_Colaboradores_ColaboradorId",
                        column: x => x.ColaboradorId,
                        principalTable: "Colaboradores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SolicitacoesBeneficios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ColaboradorId = table.Column<int>(type: "int", nullable: false),
                    TipoBeneficio = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    Descricao = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    ObservacaoRH = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CriadoEm = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AtualizadoEm = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SolicitacoesBeneficios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SolicitacoesBeneficios_Colaboradores_ColaboradorId",
                        column: x => x.ColaboradorId,
                        principalTable: "Colaboradores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_ColaboradorId",
                table: "Usuarios",
                column: "ColaboradorId");

            migrationBuilder.CreateIndex(
                name: "IX_MensagensRH_ColaboradorId",
                table: "MensagensRH",
                column: "ColaboradorId");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitacoesBeneficios_ColaboradorId",
                table: "SolicitacoesBeneficios",
                column: "ColaboradorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Usuarios_Colaboradores_ColaboradorId",
                table: "Usuarios",
                column: "ColaboradorId",
                principalTable: "Colaboradores",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Usuarios_Colaboradores_ColaboradorId",
                table: "Usuarios");

            migrationBuilder.DropTable(
                name: "MensagensRH");

            migrationBuilder.DropTable(
                name: "SolicitacoesBeneficios");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_ColaboradorId",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "ColaboradorId",
                table: "Usuarios");
        }
    }
}
