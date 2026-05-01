using CommonTemp.DTOs.Inputs.Ponto;
using DepartamentoPessoal.Server.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DepartamentoPessoal.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PontoController(IPontoService service) : ControllerBase
{
    [HttpGet("colaborador/{colaboradorId:int}")]
    public async Task<IActionResult> GetByColaborador(
        int colaboradorId,
        [FromQuery] DateTime? inicio,
        [FromQuery] DateTime? fim) =>
        Ok(await service.GetByColaboradorAsync(colaboradorId, inicio, fim));

    [HttpGet("colaborador/{colaboradorId:int}/espelho")]
    public async Task<IActionResult> GetEspelho(int colaboradorId, [FromQuery] int mes, [FromQuery] int ano) =>
        Ok(await service.GetEspelhoPontoAsync(colaboradorId, mes, ano));

    [HttpPost]
    [Authorize(Roles = "Administrador,GestorRH,OperadorPonto")]
    public async Task<IActionResult> Registrar([FromBody] RegistroPontoInput input)
    {
        var output = await service.RegistrarAsync(input);
        return Ok(output);
    }

    [HttpPatch("{id:int}/aprovar")]
    [Authorize(Roles = "Administrador,GestorRH,Aprovador")]
    public async Task<IActionResult> Aprovar(int id)
    {
        var output = await service.AprovarAsync(id);
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
