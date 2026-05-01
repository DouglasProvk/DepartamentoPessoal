using CommonTemp.DTOs.Inputs.Usuario;
using DepartamentoPessoal.Server.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DepartamentoPessoal.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Administrador")]
public class UsuariosController(IUsuarioService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await service.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var output = await service.GetByIdAsync(id);
        return output is null ? NotFound() : Ok(output);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UsuarioInput input)
    {
        var output = await service.CreateAsync(input);
        return CreatedAtAction(nameof(GetById), new { id = output.Id }, output);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UsuarioInput input)
    {
        var output = await service.UpdateAsync(id, input);
        return output is null ? NotFound() : Ok(output);
    }

    [HttpPatch("{id:int}/senha")]
    [Authorize] // qualquer autenticado pode trocar a própria senha
    public async Task<IActionResult> AlterarSenha(int id, [FromBody] AlterarSenhaInput input)
    {
        var result = await service.AlterarSenhaAsync(id, input);
        return result ? NoContent() : BadRequest(new { message = "Senha atual incorreta." });
    }

    [HttpPatch("{id:int}/toggle-ativo")]
    public async Task<IActionResult> ToggleAtivo(int id)
    {
        var result = await service.ToggleAtivoAsync(id);
        return result ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await service.DeleteAsync(id);
        return result ? NoContent() : NotFound();
    }
}
