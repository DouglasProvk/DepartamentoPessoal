using CommonTemp.DTOs.Inputs.Auth;
using DepartamentoPessoal.Server.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DepartamentoPessoal.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService service) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginInput input)
    {
        var output = await service.LoginAsync(input);
        return output is null ? Unauthorized(new { message = "E-mail ou senha inválidos." }) : Ok(output);
    }
}
