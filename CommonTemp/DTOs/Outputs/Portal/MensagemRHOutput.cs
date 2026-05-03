namespace CommonTemp.DTOs.Outputs.Portal;

public class MensagemRHOutput
{
    public int Id { get; set; }
    public int ColaboradorId { get; set; }
    public string ColaboradorNome { get; set; } = string.Empty;
    public string Assunto { get; set; } = string.Empty;
    public string Mensagem { get; set; } = string.Empty;
    public string? Resposta { get; set; }
    public string Status { get; set; } = string.Empty;
    public string StatusDescricao { get; set; } = string.Empty;
    public DateTime CriadoEm { get; set; }
    public DateTime? RespondidoEm { get; set; }
}
