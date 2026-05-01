using CommonTemp.DTOs.Inputs.Colaborador;
using DepartamentoPessoal.Server.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DepartamentoPessoal.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ColaboradoresController(IColaboradorService service) : ControllerBase
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
    [Authorize(Roles = "Administrador,GestorRH")]
    public async Task<IActionResult> Create([FromBody] ColaboradorInput input)
    {
        var output = await service.CreateAsync(input);
        return CreatedAtAction(nameof(GetById), new { id = output.Id }, output);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Administrador,GestorRH")]
    public async Task<IActionResult> Update(int id, [FromBody] ColaboradorInput input)
    {
        var output = await service.UpdateAsync(id, input);
        return output is null ? NotFound() : Ok(output);
    }

    [HttpPatch("{id:int}/inativar")]
    [Authorize(Roles = "Administrador,GestorRH")]
    public async Task<IActionResult> Inativar(int id)
    {
        var result = await service.InativarAsync(id);
        return result ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await service.DeleteAsync(id);
        return result ? NoContent() : NotFound();
    }
}
