namespace CommonTemp.DTOs.Inputs.Salario;

public class SalarioInput
{
    public int ColaboradorId { get; set; }
    public decimal ValorBase { get; set; }
    public decimal OutrosDescontos { get; set; }
    public decimal OutrosAcrescimos { get; set; }
    public int MesReferencia { get; set; }
    public int AnoReferencia { get; set; }
    public DateTime DataPagamento { get; set; }
    public string? Observacao { get; set; }
}
