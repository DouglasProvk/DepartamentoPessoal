using DepartamentoPessoal.Server.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DepartamentoPessoal.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Administrador,GestorRH,AnalistaFolha,Aprovador,Visualizador")]
public class ContrachequeController(IContrachequeService service) : ControllerBase
{
    [HttpGet("{salarioId:int}")]
    public async Task<IActionResult> Download(int salarioId)
    {
        var pdf = await service.GerarPdfAsync(salarioId);
        if (pdf is null) return NotFound();
        return File(pdf, "application/pdf", $"contracheque_{salarioId}.pdf");
    }
}
