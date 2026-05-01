using CommonTemp.DTOs.Inputs.Usuario;
using CommonTemp.DTOs.Outputs.Usuario;

namespace DepartamentoPessoal.Server.Interfaces;

public interface IUsuarioService
{
    Task<IEnumerable<UsuarioOutput>> GetAllAsync();
    Task<UsuarioOutput?> GetByIdAsync(int id);
    Task<UsuarioOutput> CreateAsync(UsuarioInput input);
    Task<UsuarioOutput?> UpdateAsync(int id, UsuarioInput input);
    Task<bool> AlterarSenhaAsync(int id, AlterarSenhaInput input);
    Task<bool> ToggleAtivoAsync(int id);
    Task<bool> DeleteAsync(int id);
}
