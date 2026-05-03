using CommonTemp.Enums;

namespace CommonTemp.Models;

public class SolicitacaoBeneficio
{
    public int Id { get; set; }
    public int ColaboradorId { get; set; }
    public TipoAbono TipoBeneficio { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public string? ObservacaoRH { get; set; }
    public StatusSolicitacaoBeneficio Status { get; set; } = StatusSolicitacaoBeneficio.Pendente;
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    public DateTime AtualizadoEm { get; set; } = DateTime.UtcNow;

    public Colaborador Colaborador { get; set; } = null!;
}
