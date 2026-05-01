namespace CommonTemp.DTOs.Outputs.Colaborador;

public class ColaboradorListOutput
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string CPF { get; set; } = string.Empty;
    public string Cargo { get; set; } = string.Empty;
    public string Departamento { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string TipoContrato { get; set; } = string.Empty;
    public DateTime DataAdmissao { get; set; }
    public string Matricula { get; set; } = string.Empty;
}
