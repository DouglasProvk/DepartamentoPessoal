using CommonTemp.Enums;

namespace CommonTemp.DTOs.Inputs.Colaborador;

public class ColaboradorInput
{
    public string Nome { get; set; } = string.Empty;
    public string CPF { get; set; } = string.Empty;
    public string RG { get; set; } = string.Empty;
    public DateTime DataNascimento { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string Cargo { get; set; } = string.Empty;
    public string Departamento { get; set; } = string.Empty;
    public DateTime DataAdmissao { get; set; }
    public TipoContrato TipoContrato { get; set; }

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
}
