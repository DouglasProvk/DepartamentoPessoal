using CommonTemp.DTOs.Inputs.Auth;
using CommonTemp.DTOs.Outputs.Auth;

namespace DepartamentoPessoal.Server.Interfaces;

public interface IAuthService
{
    Task<LoginOutput?> LoginAsync(LoginInput input);
}
