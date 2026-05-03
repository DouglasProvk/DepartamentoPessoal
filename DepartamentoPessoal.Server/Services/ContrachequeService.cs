using CommonTemp.Models;
using DepartamentoPessoal.Server.Data;
using DepartamentoPessoal.Server.Interfaces;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace DepartamentoPessoal.Server.Services;

public class ContrachequeService(AppDbContext db) : IContrachequeService
{
    private static readonly string[] NomesMeses =
        ["Janeiro","Fevereiro","Março","Abril","Maio","Junho",
         "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

    public async Task<byte[]?> GerarPdfAsync(int salarioId)
    {
        var salario = await db.Salarios
            .Include(s => s.Colaborador)
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == salarioId);

        if (salario is null) return null;

        var abonos = await db.Abonos
            .AsNoTracking()
            .Where(a => a.ColaboradorId == salario.ColaboradorId
                     && a.MesReferencia == salario.MesReferencia
                     && a.AnoReferencia == salario.AnoReferencia
                     && a.Ativo)
            .ToListAsync();

        QuestPDF.Settings.License = LicenseType.Community;

        return Document.Create(doc =>
        {
            doc.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(1.5f, Unit.Centimetre);
                page.DefaultTextStyle(t => t.FontSize(9).FontFamily("Arial"));

                page.Content().Column(col =>
                {
                    col.Spacing(6);

                    // Cabeçalho
                    col.Item().BorderBottom(2).BorderColor("#1e40af").PaddingBottom(6).Row(row =>
                    {
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text("Departamento Pessoal")
                                .FontSize(18).Bold().FontColor("#1e40af");
                            c.Item().Text("CONTRACHEQUE / RECIBO DE PAGAMENTO")
                                .FontSize(10).FontColor("#374151");
                        });
                        row.ConstantItem(140).AlignRight().Column(c =>
                        {
                            c.Item().Text($"Competência:").Bold();
                            c.Item().Text($"{NomesMeses[salario.MesReferencia - 1]}/{salario.AnoReferencia}")
                                .FontSize(12).Bold().FontColor("#1e40af");
                            c.Item().Text($"Pagamento: {salario.DataPagamento:dd/MM/yyyy}");
                        });
                    });

                    // Dados do colaborador
                    col.Item().Background("#f1f5f9").Padding(8).Column(c =>
                    {
                        c.Item().Text("DADOS DO COLABORADOR").Bold().FontSize(8).FontColor("#6b7280");
                        c.Spacing(4);
                        c.Item().Row(r =>
                        {
                            r.RelativeItem().Text(t =>
                            {
                                t.Span("Nome: ").Bold();
                                t.Span(salario.Colaborador.Nome);
                            });
                            r.ConstantItem(150).Text(t =>
                            {
                                t.Span("Matrícula: ").Bold();
                                t.Span(salario.Colaborador.Matricula);
                            });
                        });
                        c.Item().Row(r =>
                        {
                            r.RelativeItem().Text(t =>
                            {
                                t.Span("CPF: ").Bold();
                                t.Span(salario.Colaborador.CPF);
                            });
                            r.ConstantItem(150).Text(t =>
                            {
                                t.Span("Admissão: ").Bold();
                                t.Span(salario.Colaborador.DataAdmissao.ToString("dd/MM/yyyy"));
                            });
                        });
                        c.Item().Row(r =>
                        {
                            r.RelativeItem().Text(t =>
                            {
                                t.Span("Cargo: ").Bold();
                                t.Span(salario.Colaborador.Cargo);
                            });
                            r.ConstantItem(150).Text(t =>
                            {
                                t.Span("Departamento: ").Bold();
                                t.Span(salario.Colaborador.Departamento);
                            });
                        });
                    });

                    // Tabela de proventos e descontos
                    col.Item().Row(row =>
                    {
                        // Proventos
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Background("#dcfce7").Padding(5)
                                .Text("PROVENTOS").Bold().FontSize(8).FontColor("#15803d");
                            c.Item().BorderBottom(1).BorderColor("#e5e7eb")
                                .Padding(4).Row(r =>
                                {
                                    r.RelativeItem().Text("Descrição");
                                    r.ConstantItem(80).AlignRight().Text("Valor");
                                });

                            LinhaTabela(c, "Salário Base", salario.ValorBase);

                            foreach (var a in abonos)
                                LinhaTabela(c, DescricaoAbono(a.Tipo.ToString()), a.Valor);

                            if (salario.OutrosAcrescimos > 0)
                                LinhaTabela(c, "Outros Acréscimos", salario.OutrosAcrescimos);

                            var totalProventos = salario.ValorBase + abonos.Sum(a => a.Valor) + salario.OutrosAcrescimos;
                            c.Item().BorderTop(1).BorderColor("#15803d").Background("#f0fdf4")
                                .Padding(4).Row(r =>
                                {
                                    r.RelativeItem().Text("TOTAL PROVENTOS").Bold();
                                    r.ConstantItem(80).AlignRight()
                                        .Text(FormatarMoeda(totalProventos)).Bold().FontColor("#15803d");
                                });
                        });

                        row.ConstantItem(12);

                        // Descontos
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Background("#fee2e2").Padding(5)
                                .Text("DESCONTOS").Bold().FontSize(8).FontColor("#dc2626");
                            c.Item().BorderBottom(1).BorderColor("#e5e7eb")
                                .Padding(4).Row(r =>
                                {
                                    r.RelativeItem().Text("Descrição");
                                    r.ConstantItem(80).AlignRight().Text("Valor");
                                });

                            LinhaTabela(c, "INSS", salario.Inss);
                            LinhaTabela(c, "IRRF", salario.Irrf);

                            if (salario.OutrosDescontos > 0)
                                LinhaTabela(c, "Outros Descontos", salario.OutrosDescontos);

                            var totalDescontos = salario.Inss + salario.Irrf + salario.OutrosDescontos;
                            c.Item().BorderTop(1).BorderColor("#dc2626").Background("#fef2f2")
                                .Padding(4).Row(r =>
                                {
                                    r.RelativeItem().Text("TOTAL DESCONTOS").Bold();
                                    r.ConstantItem(80).AlignRight()
                                        .Text(FormatarMoeda(totalDescontos)).Bold().FontColor("#dc2626");
                                });
                        });
                    });

                    // FGTS (encargo empresa)
                    col.Item().Border(1).BorderColor("#e5e7eb").Padding(6).Row(r =>
                    {
                        r.RelativeItem().Text(t =>
                        {
                            t.Span("FGTS (Encargo Empresa — 8%): ").Bold();
                            t.Span("Não é descontado do salário").FontSize(8).FontColor("#6b7280");
                        });
                        r.ConstantItem(120).AlignRight().Text(FormatarMoeda(salario.Fgts)).Bold();
                    });

                    // Salário líquido
                    col.Item().Background("#1e40af").Padding(10).Row(r =>
                    {
                        r.RelativeItem().Text("SALÁRIO LÍQUIDO A RECEBER")
                            .Bold().FontSize(13).FontColor(Colors.White);
                        r.ConstantItem(160).AlignRight()
                            .Text(FormatarMoeda(salario.ValorLiquido))
                            .Bold().FontSize(14).FontColor(Colors.White);
                    });

                    // Observação
                    if (!string.IsNullOrWhiteSpace(salario.Observacao))
                    {
                        col.Item().Background("#fef9c3").Padding(6).Column(c =>
                        {
                            c.Item().Text("Observação:").Bold().FontSize(8);
                            c.Item().Text(salario.Observacao);
                        });
                    }

                    // Status de pagamento
                    col.Item().AlignRight().Text(salario.Pago
                        ? "✓ PAGO"
                        : "⏳ AGUARDANDO PAGAMENTO")
                        .Bold().FontSize(10)
                        .FontColor(salario.Pago ? "#15803d" : "#d97706");

                    // Assinaturas
                    col.Item().PaddingTop(20).Row(r =>
                    {
                        r.RelativeItem().Column(c =>
                        {
                            c.Item().BorderBottom(1).BorderColor("#374151").Height(30);
                            c.Item().PaddingTop(4).Text("Assinatura do Colaborador").AlignCenter().FontSize(8);
                        });
                        r.ConstantItem(40);
                        r.RelativeItem().Column(c =>
                        {
                            c.Item().BorderBottom(1).BorderColor("#374151").Height(30);
                            c.Item().PaddingTop(4).Text("Departamento Pessoal / RH").AlignCenter().FontSize(8);
                        });
                    });

                    // Rodapé
                    col.Item().PaddingTop(8).AlignCenter()
                        .Text($"Documento gerado em {DateTime.Now:dd/MM/yyyy HH:mm}")
                        .FontSize(7).FontColor("#9ca3af");
                });
            });
        }).GeneratePdf();
    }

    private static void LinhaTabela(ColumnDescriptor col, string descricao, decimal valor)
    {
        col.Item().BorderBottom(1).BorderColor("#f3f4f6").Padding(4).Row(r =>
        {
            r.RelativeItem().Text(descricao);
            r.ConstantItem(80).AlignRight().Text(FormatarMoeda(valor));
        });
    }

    private static string FormatarMoeda(decimal valor) =>
        valor.ToString("C2", new System.Globalization.CultureInfo("pt-BR"));

    private static string DescricaoAbono(string tipo) => tipo switch
    {
        "ValeTransporte" => "Vale Transporte",
        "ValeAlimentacao" => "Vale Alimentação",
        "PlanoSaude" => "Plano de Saúde",
        "PlanoOdontologico" => "Plano Odontológico",
        "Bonus" => "Bônus",
        "ComissaoVendas" => "Comissão de Vendas",
        "AdicionalNoturno" => "Adicional Noturno",
        "HoraExtra" => "Hora Extra",
        _ => tipo
    };
}
