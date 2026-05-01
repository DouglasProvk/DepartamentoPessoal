using CommonTemp.DTOs.Inputs.Ponto;
using CommonTemp.DTOs.Outputs.Ponto;
using CommonTemp.Enums;
using CommonTemp.Models;
using DepartamentoPessoal.Server.Data;
using DepartamentoPessoal.Server.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DepartamentoPessoal.Server.Services;

public class PontoService(AppDbContext db) : IPontoService
{
    public async Task<IEnumerable<RegistroPontoOutput>> GetByColaboradorAsync(int colaboradorId, DateTime? inicio = null, DateTime? fim = null)
    {
        var query = db.RegistrosPonto
            .AsNoTracking()
            .Include(r => r.Colaborador)
            .Where(r => r.ColaboradorId == colaboradorId);

        if (inicio.HasValue) query = query.Where(r => r.DataHora >= inicio.Value);
        if (fim.HasValue) query = query.Where(r => r.DataHora <= fim.Value);

        return await query
            .OrderByDescending(r => r.DataHora)
            .Select(r => MapToOutput(r))
            .ToListAsync();
    }

    public async Task<IEnumerable<PontoDiarioOutput>> GetEspelhoPontoAsync(int colaboradorId, int mes, int ano)
    {
        var inicio = new DateTime(ano, mes, 1);
        var fim = inicio.AddMonths(1).AddDays(-1);

        var registros = await db.RegistrosPonto
            .AsNoTracking()
            .Where(r => r.ColaboradorId == colaboradorId && r.DataHora >= inicio && r.DataHora <= fim)
            .OrderBy(r => r.DataHora)
            .ToListAsync();

        var espelho = new List<PontoDiarioOutput>();

        for (var data = inicio; data <= fim; data = data.AddDays(1))
        {
            var dodia = registros.Where(r => r.DataHora.Date == data.Date).ToList();
            var entrada = dodia.FirstOrDefault(r => r.Tipo == TipoRegistroPonto.Entrada);
            var saidaAlmoco = dodia.FirstOrDefault(r => r.Tipo == TipoRegistroPonto.SaidaAlmoco);
            var retornoAlmoco = dodia.FirstOrDefault(r => r.Tipo == TipoRegistroPonto.RetornoAlmoco);
            var saida = dodia.FirstOrDefault(r => r.Tipo == TipoRegistroPonto.Saida);

            var totalMin = 0.0;
            if (entrada is not null && saida is not null)
            {
                var totalBruto = (saida.DataHora - entrada.DataHora).TotalMinutes;
                var almoco = (saidaAlmoco is not null && retornoAlmoco is not null)
                    ? (retornoAlmoco.DataHora - saidaAlmoco.DataHora).TotalMinutes
                    : 0;
                totalMin = totalBruto - almoco;
            }

            var ocorrencia = dodia.FirstOrDefault()?.Ocorrencia ?? TipoOcorrenciaPonto.Normal;

            espelho.Add(new PontoDiarioOutput
            {
                Data = data,
                Entrada = entrada?.DataHora.ToString("HH:mm"),
                SaidaAlmoco = saidaAlmoco?.DataHora.ToString("HH:mm"),
                RetornoAlmoco = retornoAlmoco?.DataHora.ToString("HH:mm"),
                Saida = saida?.DataHora.ToString("HH:mm"),
                TotalTrabalhado = totalMin > 0 ? $"{(int)(totalMin / 60):D2}:{(int)(totalMin % 60):D2}" : "--:--",
                Ocorrencia = ocorrencia.ToString(),
                Justificativa = dodia.FirstOrDefault()?.Justificativa
            });
        }

        return espelho;
    }

    public async Task<RegistroPontoOutput> RegistrarAsync(RegistroPontoInput input)
    {
        var registro = new RegistroPonto
        {
            ColaboradorId = input.ColaboradorId,
            DataHora = input.DataHora,
            Tipo = input.Tipo,
            Justificativa = input.Justificativa,
            Aprovado = true
        };

        db.RegistrosPonto.Add(registro);
        await db.SaveChangesAsync();
        await db.Entry(registro).Reference(r => r.Colaborador).LoadAsync();
        return MapToOutput(registro);
    }

    public async Task<RegistroPontoOutput?> AprovarAsync(int id)
    {
        var registro = await db.RegistrosPonto.Include(r => r.Colaborador).FirstOrDefaultAsync(r => r.Id == id);
        if (registro is null) return null;
        registro.Aprovado = true;
        await db.SaveChangesAsync();
        return MapToOutput(registro);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var registro = await db.RegistrosPonto.FindAsync(id);
        if (registro is null) return false;
        db.RegistrosPonto.Remove(registro);
        await db.SaveChangesAsync();
        return true;
    }

    private static RegistroPontoOutput MapToOutput(RegistroPonto r) => new()
    {
        Id = r.Id,
        ColaboradorId = r.ColaboradorId,
        ColaboradorNome = r.Colaborador?.Nome ?? string.Empty,
        DataHora = r.DataHora,
        Tipo = r.Tipo,
        TipoDescricao = r.Tipo.ToString(),
        Ocorrencia = r.Ocorrencia,
        OcorrenciaDescricao = r.Ocorrencia.ToString(),
        Justificativa = r.Justificativa,
        Aprovado = r.Aprovado,
        CriadoEm = r.CriadoEm
    };
}
