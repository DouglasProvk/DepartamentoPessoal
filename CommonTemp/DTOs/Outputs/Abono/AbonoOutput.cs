using CommonTemp.Enums;

namespace CommonTemp.DTOs.Outputs.Abono;

public class AbonoOutput
{
    public int Id { get; set; }
    public int ColaboradorId { get; set; }
    public string ColaboradorNome { get; set; } = string.Empty;
    public TipoAbono Tipo { get; set; }
    public string TipoDescricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public int MesReferencia { get; set; }
    public int AnoReferencia { get; set; }
    public bool Ativo { get; set; }
    public DateTime CriadoEm { get; set; }
}
