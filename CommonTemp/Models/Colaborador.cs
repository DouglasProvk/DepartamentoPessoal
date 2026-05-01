using CommonTemp.Enums;

namespace CommonTemp.Models;

public class Colaborador
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
    public TipoContrato TipoContrato { get; set; }
    public StatusColaborador Status { get; set; }
    public string Matricula { get; set; } = string.Empty;

    // Endereço
    public string Logradouro { get; set; } = string.Empty;
    public string Numero { get; set; } = string.Empty;
    public string Complemento { get; set; } = string.Empty;
    public string Bairro { get; set; } = string.Empty;
    public string Cidade { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public string CEP { get; set; } = string.Empty;

    // Dados bancários
    public string Banco { get; set; } = string.Empty;
    public string Agencia { get; set; } = string.Empty;
    public string ContaBancaria { get; set; } = string.Empty;

    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    public DateTime AtualizadoEm { get; set; } = DateTime.UtcNow;

    // Navegação
    public ICollection<Salario> Salarios { get; set; } = [];
    public ICollection<Abono> Abonos { get; set; } = [];
    public ICollection<RegistroPonto> RegistrosPonto { get; set; } = [];
}
