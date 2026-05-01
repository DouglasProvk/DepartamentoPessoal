using CommonTemp.Enums;

namespace CommonTemp.Models;

public class RegistroPonto
{
    public int Id { get; set; }
    public int ColaboradorId { get; set; }
    public DateTime DataHora { get; set; }
    public TipoRegistroPonto Tipo { get; set; }
    public TipoOcorrenciaPonto Ocorrencia { get; set; } = TipoOcorrenciaPonto.Normal;
    public string? Justificativa { get; set; }
    public bool Aprovado { get; set; } = true;

    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

    // Navegação
    public Colaborador Colaborador { get; set; } = null!;
}
