using CommonTemp.DTOs.Inputs.Portal;
using CommonTemp.DTOs.Outputs.Abono;
using CommonTemp.DTOs.Outputs.Colaborador;
using CommonTemp.DTOs.Outputs.Portal;
using CommonTemp.DTOs.Outputs.Salario;
using CommonTemp.Enums;
using CommonTemp.Models;
using DepartamentoPessoal.Server.Data;
using DepartamentoPessoal.Server.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DepartamentoPessoal.Server.Services;

public class PortalService(AppDbContext db) : IPortalService
{
    public async Task<ColaboradorOutput?> GetMeAsync(int colaboradorId)
    {
        var c = await db.Colaboradores.AsNoTracking().FirstOrDefaultAsync(x => x.Id == colaboradorId);
        return c is null ? null : MapColaborador(c);
    }

    public async Task<IEnumerable<SalarioOutput>> GetMeusContracheques(int colaboradorId)
    {
        return await db.Salarios
            .AsNoTracking()
            .Include(s => s.Colaborador)
            .Where(s => s.ColaboradorId == colaboradorId)
            .OrderByDescending(s => s.AnoReferencia)
            .ThenByDescending(s => s.MesReferencia)
            .Select(s => MapSalario(s))
            .ToListAsync();
    }

    public async Task<IEnumerable<AbonoOutput>> GetMeusBeneficiosAsync(int colaboradorId)
    {
        return await db.Abonos
            .AsNoTracking()
            .Include(a => a.Colaborador)
            .Where(a => a.ColaboradorId == colaboradorId && a.Ativo)
            .OrderByDescending(a => a.AnoReferencia)
            .ThenByDescending(a => a.MesReferencia)
            .Select(a => MapAbono(a))
            .ToListAsync();
    }

    public async Task<IEnumerable<MensagemRHOutput>> GetMinhasMensagensAsync(int colaboradorId)
    {
        return await db.MensagensRH
            .AsNoTracking()
            .Include(m => m.Colaborador)
            .Where(m => m.ColaboradorId == colaboradorId)
            .OrderByDescending(m => m.CriadoEm)
            .Select(m => MapMensagem(m))
            .ToListAsync();
    }

    public async Task<MensagemRHOutput> EnviarMensagemAsync(int colaboradorId, MensagemRHInput input)
    {
        var mensagem = new MensagemRH
        {
            ColaboradorId = colaboradorId,
            Assunto = input.Assunto,
            Mensagem = input.Mensagem,
            Status = StatusMensagemRH.Aberta
        };
        db.MensagensRH.Add(mensagem);
        await db.SaveChangesAsync();
        await db.Entry(mensagem).Reference(m => m.Colaborador).LoadAsync();
        return MapMensagem(mensagem);
    }

    public async Task<IEnumerable<SolicitacaoBeneficioOutput>> GetMinhasSolicitacoesAsync(int colaboradorId)
    {
        return await db.SolicitacoesBeneficios
            .AsNoTracking()
            .Include(s => s.Colaborador)
            .Where(s => s.ColaboradorId == colaboradorId)
            .OrderByDescending(s => s.CriadoEm)
            .Select(s => MapSolicitacao(s))
            .ToListAsync();
    }

    public async Task<SolicitacaoBeneficioOutput> CriarSolicitacaoAsync(int colaboradorId, SolicitacaoBeneficioInput input)
    {
        if (!Enum.TryParse<TipoAbono>(input.TipoBeneficio, out var tipo))
            tipo = TipoAbono.Outros;

        var solicitacao = new SolicitacaoBeneficio
        {
            ColaboradorId = colaboradorId,
            TipoBeneficio = tipo,
            Descricao = input.Descricao,
            Status = StatusSolicitacaoBeneficio.Pendente
        };
        db.SolicitacoesBeneficios.Add(solicitacao);
        await db.SaveChangesAsync();
        await db.Entry(solicitacao).Reference(s => s.Colaborador).LoadAsync();
        return MapSolicitacao(solicitacao);
    }

    private static ColaboradorOutput MapColaborador(CommonTemp.Models.Colaborador c) => new()
    {
        Id = c.Id, Nome = c.Nome, CPF = c.CPF, RG = c.RG,
        DataNascimento = c.DataNascimento, Email = c.Email, Telefone = c.Telefone,
        Cargo = c.Cargo, Departamento = c.Departamento, DataAdmissao = c.DataAdmissao,
        DataDemissao = c.DataDemissao, TipoContrato = c.TipoContrato.ToString(),
        Status = c.Status.ToString(), Matricula = c.Matricula,
        Logradouro = c.Logradouro, Numero = c.Numero, Complemento = c.Complemento,
        Bairro = c.Bairro, Cidade = c.Cidade, Estado = c.Estado, CEP = c.CEP,
        Banco = c.Banco, Agencia = c.Agencia, ContaBancaria = c.ContaBancaria,
        CriadoEm = c.CriadoEm, AtualizadoEm = c.AtualizadoEm
    };

    private static SalarioOutput MapSalario(Salario s) => new()
    {
        Id = s.Id, ColaboradorId = s.ColaboradorId,
        ColaboradorNome = s.Colaborador?.Nome ?? string.Empty,
        ValorBase = s.ValorBase, Inss = s.Inss, Fgts = s.Fgts, Irrf = s.Irrf,
        OutrosDescontos = s.OutrosDescontos, OutrosAcrescimos = s.OutrosAcrescimos,
        ValorLiquido = s.ValorLiquido, MesReferencia = s.MesReferencia,
        AnoReferencia = s.AnoReferencia, DataPagamento = s.DataPagamento,
        Pago = s.Pago, Observacao = s.Observacao, CriadoEm = s.CriadoEm
    };

    private static AbonoOutput MapAbono(Abono a) => new()
    {
        Id = a.Id, ColaboradorId = a.ColaboradorId,
        ColaboradorNome = a.Colaborador?.Nome ?? string.Empty,
        Tipo = a.Tipo, TipoDescricao = a.Tipo.ToString(),
        Valor = a.Valor, Descricao = a.Descricao,
        MesReferencia = a.MesReferencia, AnoReferencia = a.AnoReferencia,
        Ativo = a.Ativo, CriadoEm = a.CriadoEm
    };

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
