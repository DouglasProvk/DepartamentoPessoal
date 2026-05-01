using CommonTemp.Enums;

namespace CommonTemp.DTOs.Inputs.Ponto;

public class RegistroPontoInput
{
    public int ColaboradorId { get; set; }
    public DateTime DataHora { get; set; }
    public TipoRegistroPonto Tipo { get; set; }
    public string? Justificativa { get; set; }
}
