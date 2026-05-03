using CommonTemp.DTOs.Inputs.Portal;
using DepartamentoPessoal.Server.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DepartamentoPessoal.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Administrador,GestorRH,AnalistaFolha")]
public class MensagensRHController(IMensagensRHService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMensagens() =>
        Ok(await service.GetAllMensagensAsync());

    [HttpPut("{id:int}/responder")]
    public async Task<IActionResult> Responder(int id, [FromBody] ResponderMensagemInput input)
    {
        var result = await service.ResponderAsync(id, input);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("solicitacoes")]
    public async Task<IActionResult> GetSolicitacoes() =>
        Ok(await service.GetAllSolicitacoesAsync());

    [HttpPut("solicitacoes/{id:int}")]
    public async Task<IActionResult> AtualizarSolicitacao(int id, [FromBody] AtualizarSolicitacaoInput input)
    {
        var result = await service.AtualizarSolicitacaoAsync(id, input);
        return result is null ? NotFound() : Ok(result);
    }
}
