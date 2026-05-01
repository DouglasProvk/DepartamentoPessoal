using CommonTemp.Enums;

namespace CommonTemp.DTOs.Inputs.Abono;

public class AbonoInput
{
    public int ColaboradorId { get; set; }
    public TipoAbono Tipo { get; set; }
    public decimal Valor { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public int MesReferencia { get; set; }
    public int AnoReferencia { get; set; }
}
