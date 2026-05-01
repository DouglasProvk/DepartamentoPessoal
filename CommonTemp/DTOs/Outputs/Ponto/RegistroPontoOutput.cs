using CommonTemp.Enums;

namespace CommonTemp.DTOs.Outputs.Ponto;

public class RegistroPontoOutput
{
    public int Id { get; set; }
    public int ColaboradorId { get; set; }
    public string ColaboradorNome { get; set; } = string.Empty;
    public DateTime DataHora { get; set; }
    public TipoRegistroPonto Tipo { get; set; }
    public string TipoDescricao { get; set; } = string.Empty;
    public TipoOcorrenciaPonto Ocorrencia { get; set; }
    public string OcorrenciaDescricao { get; set; } = string.Empty;
    public string? Justificativa { get; set; }
    public bool Aprovado { get; set; }
    public DateTime CriadoEm { get; set; }
}
