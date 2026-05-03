namespace CommonTemp.DTOs.Outputs.Portal;

public class SolicitacaoBeneficioOutput
{
    public int Id { get; set; }
    public int ColaboradorId { get; set; }
    public string ColaboradorNome { get; set; } = string.Empty;
    public string TipoBeneficio { get; set; } = string.Empty;
    public string TipoBeneficioDescricao { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public string? ObservacaoRH { get; set; }
    public string Status { get; set; } = string.Empty;
    public string StatusDescricao { get; set; } = string.Empty;
    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }
}
