using CommonTemp.DTOs.Inputs.Abono;
using DepartamentoPessoal.Server.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DepartamentoPessoal.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AbonosController(IAbonoService service) : ControllerBase
{
    [HttpGet("colaborador/{colaboradorId:int}")]
    public async Task<IActionResult> GetByColaborador(int colaboradorId) =>
        Ok(await service.GetByColaboradorAsync(colaboradorId));

    [HttpGet("periodo")]
    public async Task<IActionResult> GetByPeriodo([FromQuery] int mes, [FromQuery] int ano) =>
        Ok(await service.GetByPeriodoAsync(mes, ano));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var output = await service.GetByIdAsync(id);
        return output is null ? NotFound() : Ok(output);
    }

    [HttpPost]
    [Authorize(Roles = "Administrador,AnalistaFolha")]
    public async Task<IActionResult> Create([FromBody] AbonoInput input)
    {
        var output = await service.CreateAsync(input);
        return CreatedAtAction(nameof(GetById), new { id = output.Id }, output);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Administrador,AnalistaFolha")]
    public async Task<IActionResult> Update(int id, [FromBody] AbonoInput input)
    {
        var output = await service.UpdateAsync(id, input);
        return output is null ? NotFound() : Ok(output);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await service.DeleteAsync(id);
        return result ? NoContent() : NotFound();
    }
}
