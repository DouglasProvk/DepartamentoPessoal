using CommonTemp.DTOs.Inputs.Salario;
using DepartamentoPessoal.Server.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DepartamentoPessoal.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SalariosController(ISalarioService service) : ControllerBase
{
    [HttpGet("colaborador/{colaboradorId:int}")]
    public async Task<IActionResult> GetByColaborador(int colaboradorId) =>
        Ok(await service.GetByColaboradorAsync(colaboradorId));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var output = await service.GetByIdAsync(id);
        return output is null ? NotFound() : Ok(output);
    }

    [HttpPost]
    [Authorize(Roles = "Administrador,AnalistaFolha")]
    public async Task<IActionResult> Create([FromBody] SalarioInput input)
    {
        var output = await service.CreateAsync(input);
        return CreatedAtAction(nameof(GetById), new { id = output.Id }, output);
    }

    [HttpPatch("{id:int}/pagar")]
    [Authorize(Roles = "Administrador,GestorRH,Aprovador")]
    public async Task<IActionResult> MarcarComoPago(int id)
    {
        var output = await service.MarcarComoPagoAsync(id);
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
