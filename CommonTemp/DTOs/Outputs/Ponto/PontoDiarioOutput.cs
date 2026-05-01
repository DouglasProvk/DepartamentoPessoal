namespace CommonTemp.DTOs.Outputs.Ponto;

public class PontoDiarioOutput
{
    public DateTime Data { get; set; }
    public string? Entrada { get; set; }
    public string? SaidaAlmoco { get; set; }
    public string? RetornoAlmoco { get; set; }
    public string? Saida { get; set; }
    public string TotalTrabalhado { get; set; } = string.Empty;
    public string Ocorrencia { get; set; } = string.Empty;
    public string? Justificativa { get; set; }
}
