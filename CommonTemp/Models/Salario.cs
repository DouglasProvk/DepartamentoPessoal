namespace CommonTemp.Models;

public class Salario
{
    public int Id { get; set; }
    public int ColaboradorId { get; set; }
    public decimal ValorBase { get; set; }
    public decimal Inss { get; set; }
    public decimal Fgts { get; set; }
    public decimal Irrf { get; set; }
    public decimal OutrosDescontos { get; set; }
    public decimal OutrosAcrescimos { get; set; }
    public decimal ValorLiquido { get; set; }
    public int MesReferencia { get; set; }
    public int AnoReferencia { get; set; }
    public DateTime DataPagamento { get; set; }
    public bool Pago { get; set; }
    public string? Observacao { get; set; }

    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

    // Navegação
    public Colaborador Colaborador { get; set; } = null!;
}
