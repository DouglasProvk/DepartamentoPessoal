using CommonTemp.Enums;

namespace CommonTemp.DTOs.Inputs.Usuario;

public class UsuarioInput
{
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
    public PerfilUsuario Perfil { get; set; }
}
