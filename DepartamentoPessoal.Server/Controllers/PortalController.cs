using System.Security.Claims;
using CommonTemp.DTOs.Inputs.Portal;
using DepartamentoPessoal.Server.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DepartamentoPessoal.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Colaborador")]
public class PortalController(IPortalService portalService, IContrachequeService contrachequeService) : ControllerBase
{
    private int GetColaboradorId()
    {
        var claim = User.FindFirstValue("colaboradorId");
        return int.TryParse(claim, out var id) ? id : 0;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var id = GetColaboradorId();
        if (id == 0) return Forbid();
        var result = await portalService.GetMeAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("contracheques")]
    public async Task<IActionResult> GetContracheques()
    {
        var id = GetColaboradorId();
        if (id == 0) return Forbid();
        var result = await portalService.GetMeusContracheques(id);
        return Ok(result);
    }

    [HttpGet("contracheques/{salarioId:int}/pdf")]
    public async Task<IActionResult> DownloadContracheque(int salarioId)
    {
        var colaboradorId = GetColaboradorId();
        if (colaboradorId == 0) return Forbid();

        // Garante que o PDF pertence ao colaborador autenticado
        var contracheques = await portalService.GetMeusContracheques(colaboradorId);
        if (!contracheques.Any(c => c.Id == salarioId))
            return Forbid();

        var pdf = await contrachequeService.GerarPdfAsync(salarioId);
        if (pdf is null) return NotFound();
        return File(pdf, "application/pdf", $"contracheque_{salarioId}.pdf");
    }

    [HttpGet("beneficios")]
    public async Task<IActionResult> GetBeneficios()
    {
        var id = GetColaboradorId();
        if (id == 0) return Forbid();
        var result = await portalService.GetMeusBeneficiosAsync(id);
        return Ok(result);
    }

    [HttpGet("mensagens")]
    public async Task<IActionResult> GetMensagens()
    {
        var id = GetColaboradorId();
        if (id == 0) return Forbid();
        var result = await portalService.GetMinhasMensagensAsync(id);
        return Ok(result);
    }

    [HttpPost("mensagens")]
    public async Task<IActionResult> EnviarMensagem([FromBody] MensagemRHInput input)
    {
        var id = GetColaboradorId();
        if (id == 0) return Forbid();
        var result = await portalService.EnviarMensagemAsync(id, input);
        return CreatedAtAction(nameof(GetMensagens), result);
    }

    [HttpGet("solicitacoes")]
    public async Task<IActionResult> GetSolicitacoes()
    {
        var id = GetColaboradorId();
        if (id == 0) return Forbid();
        var result = await portalService.GetMinhasSolicitacoesAsync(id);
        return Ok(result);
    }

    [HttpPost("solicitacoes")]
    public async Task<IActionResult> CriarSolicitacao([FromBody] SolicitacaoBeneficioInput input)
    {
        var id = GetColaboradorId();
        if (id == 0) return Forbid();
        var result = await portalService.CriarSolicitacaoAsync(id, input);
        return CreatedAtAction(nameof(GetSolicitacoes), result);
    }
}
