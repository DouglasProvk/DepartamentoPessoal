using CommonTemp.Enums;

namespace CommonTemp.DTOs.Outputs.Colaborador;

public class ColaboradorOutput
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string CPF { get; set; } = string.Empty;
    public string RG { get; set; } = string.Empty;
    public DateTime DataNascimento { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string Cargo { get; set; } = string.Empty;
    public string Departamento { get; set; } = string.Empty;
    public DateTime DataAdmissao { get; set; }
    public DateTime? DataDemissao { get; set; }
    public string TipoContrato { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Matricula { get; set; } = string.Empty;

    public string Logradouro { get; set; } = string.Empty;
    public string Numero { get; set; } = string.Empty;
    public string Complemento { get; set; } = string.Empty;
    public string Bairro { get; set; } = string.Empty;
    public string Cidade { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public string CEP { get; set; } = string.Empty;

    public string Banco { get; set; } = string.Empty;
    public string Agencia { get; set; } = string.Empty;
    public string ContaBancaria { get; set; } = string.Empty;

    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }
}
