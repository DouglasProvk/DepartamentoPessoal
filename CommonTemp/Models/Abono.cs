using CommonTemp.Enums;

namespace CommonTemp.Models;

public class Abono
{
    public int Id { get; set; }
    public int ColaboradorId { get; set; }
    public TipoAbono Tipo { get; set; }
    public decimal Valor { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public int MesReferencia { get; set; }
    public int AnoReferencia { get; set; }
    public bool Ativo { get; set; } = true;
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

    // Navegação
    public Colaborador Colaborador { get; set; } = null!;
}
