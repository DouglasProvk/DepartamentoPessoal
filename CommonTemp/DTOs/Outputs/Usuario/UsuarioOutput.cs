using CommonTemp.Enums;

namespace CommonTemp.DTOs.Outputs.Usuario;

public class UsuarioOutput
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public PerfilUsuario Perfil { get; set; }
    public string PerfilDescricao { get; set; } = string.Empty;
    public bool Ativo { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime? UltimoAcessoEm { get; set; }
}
