using CommonTemp.Enums;

namespace CommonTemp.Models;

public class MensagemRH
{
    public int Id { get; set; }
    public int ColaboradorId { get; set; }
    public string Assunto { get; set; } = string.Empty;
    public string Mensagem { get; set; } = string.Empty;
    public string? Resposta { get; set; }
    public StatusMensagemRH Status { get; set; } = StatusMensagemRH.Aberta;
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    public DateTime? RespondidoEm { get; set; }

    public Colaborador Colaborador { get; set; } = null!;
}
