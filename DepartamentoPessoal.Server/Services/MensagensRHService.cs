using CommonTemp.DTOs.Inputs.Portal;
using CommonTemp.DTOs.Outputs.Portal;
using CommonTemp.Enums;
using CommonTemp.Models;
using DepartamentoPessoal.Server.Data;
using DepartamentoPessoal.Server.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DepartamentoPessoal.Server.Services;

public class MensagensRHService(AppDbContext db) : IMensagensRHService
{
    public async Task<IEnumerable<MensagemRHOutput>> GetAllMensagensAsync()
    {
        return await db.MensagensRH
            .AsNoTracking()
            .Include(m => m.Colaborador)
            .OrderByDescending(m => m.CriadoEm)
            .Select(m => MapMensagem(m))
            .ToListAsync();
    }

    public async Task<MensagemRHOutput?> ResponderAsync(int id, ResponderMensagemInput input)
    {
        var mensagem = await db.MensagensRH
            .Include(m => m.Colaborador)
            .FirstOrDefaultAsync(m => m.Id == id);
        if (mensagem is null) return null;

        mensagem.Resposta = input.Resposta;
        mensagem.Status = StatusMensagemRH.Respondida;
        mensagem.RespondidoEm = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return MapMensagem(mensagem);
    }

    public async Task<IEnumerable<SolicitacaoBeneficioOutput>> GetAllSolicitacoesAsync()
    {
        return await db.SolicitacoesBeneficios
            .AsNoTracking()
            .Include(s => s.Colaborador)
            .OrderByDescending(s => s.CriadoEm)
            .Select(s => MapSolicitacao(s))
            .ToListAsync();
    }

    public async Task<SolicitacaoBeneficioOutput?> AtualizarSolicitacaoAsync(int id, AtualizarSolicitacaoInput input)
    {
        var solicitacao = await db.SolicitacoesBeneficios
            .Include(s => s.Colaborador)
            .FirstOrDefaultAsync(s => s.Id == id);
        if (solicitacao is null) return null;

        if (Enum.TryParse<StatusSolicitacaoBeneficio>(input.Status, out var status))
            solicitacao.Status = status;

        solicitacao.ObservacaoRH = input.ObservacaoRH;
        solicitacao.AtualizadoEm = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return MapSolicitacao(solicitacao);
    }

    private static MensagemRHOutput MapMensagem(MensagemRH m) => new()
    {
        Id = m.Id, ColaboradorId = m.ColaboradorId,
        ColaboradorNome = m.Colaborador?.Nome ?? string.Empty,
        Assunto = m.Assunto, Mensagem = m.Mensagem, Resposta = m.Resposta,
        Status = m.Status.ToString(),
        StatusDescricao = m.Status switch
        {
            StatusMensagemRH.Aberta => "Aberta",
            StatusMensagemRH.Respondida => "Respondida",
            StatusMensagemRH.Fechada => "Fechada",
            _ => m.Status.ToString()
        },
        CriadoEm = m.CriadoEm, RespondidoEm = m.RespondidoEm
    };

    private static SolicitacaoBeneficioOutput MapSolicitacao(SolicitacaoBeneficio s) => new()
    {
        Id = s.Id, ColaboradorId = s.ColaboradorId,
        ColaboradorNome = s.Colaborador?.Nome ?? string.Empty,
        TipoBeneficio = s.TipoBeneficio.ToString(),
        TipoBeneficioDescricao = s.TipoBeneficio switch
        {
            TipoAbono.ValeTransporte => "Vale Transporte",
            TipoAbono.ValeAlimentacao => "Vale Alimentação",
            TipoAbono.PlanoSaude => "Plano de Saúde",
            TipoAbono.PlanoOdontologico => "Plano Odontológico",
            TipoAbono.Bonus => "Bônus",
            TipoAbono.ComissaoVendas => "Comissão de Vendas",
            TipoAbono.AdicionalNoturno => "Adicional Noturno",
            TipoAbono.HoraExtra => "Hora Extra",
            _ => "Outros"
        },
        Descricao = s.Descricao, ObservacaoRH = s.ObservacaoRH,
        Status = s.Status.ToString(),
        StatusDescricao = s.Status switch
        {
            StatusSolicitacaoBeneficio.Pendente => "Pendente",
            StatusSolicitacaoBeneficio.Aprovada => "Aprovada",
            StatusSolicitacaoBeneficio.Negada => "Negada",
            _ => s.Status.ToString()
        },
        CriadoEm = s.CriadoEm, AtualizadoEm = s.AtualizadoEm
    };
}
