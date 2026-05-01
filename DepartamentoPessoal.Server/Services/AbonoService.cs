using CommonTemp.DTOs.Inputs.Abono;
using CommonTemp.DTOs.Outputs.Abono;
using CommonTemp.Models;
using DepartamentoPessoal.Server.Data;
using DepartamentoPessoal.Server.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DepartamentoPessoal.Server.Services;

public class AbonoService(AppDbContext db) : IAbonoService
{
    public async Task<IEnumerable<AbonoOutput>> GetByColaboradorAsync(int colaboradorId)
    {
        return await db.Abonos
            .AsNoTracking()
            .Include(a => a.Colaborador)
            .Where(a => a.ColaboradorId == colaboradorId)
            .OrderByDescending(a => a.AnoReferencia)
            .ThenByDescending(a => a.MesReferencia)
            .Select(a => MapToOutput(a))
            .ToListAsync();
    }

    public async Task<IEnumerable<AbonoOutput>> GetByPeriodoAsync(int mes, int ano)
    {
        return await db.Abonos
            .AsNoTracking()
            .Include(a => a.Colaborador)
            .Where(a => a.MesReferencia == mes && a.AnoReferencia == ano && a.Ativo)
            .Select(a => MapToOutput(a))
            .ToListAsync();
    }

    public async Task<AbonoOutput?> GetByIdAsync(int id)
    {
        var a = await db.Abonos.Include(x => x.Colaborador).AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return a is null ? null : MapToOutput(a);
    }

    public async Task<AbonoOutput> CreateAsync(AbonoInput input)
    {
        var abono = new Abono
        {
            ColaboradorId = input.ColaboradorId,
            Tipo = input.Tipo,
            Valor = input.Valor,
            Descricao = input.Descricao,
            MesReferencia = input.MesReferencia,
            AnoReferencia = input.AnoReferencia,
            Ativo = true
        };

        db.Abonos.Add(abono);
        await db.SaveChangesAsync();
        await db.Entry(abono).Reference(a => a.Colaborador).LoadAsync();
        return MapToOutput(abono);
    }

    public async Task<AbonoOutput?> UpdateAsync(int id, AbonoInput input)
    {
        var abono = await db.Abonos.Include(a => a.Colaborador).FirstOrDefaultAsync(a => a.Id == id);
        if (abono is null) return null;

        abono.Tipo = input.Tipo;
        abono.Valor = input.Valor;
        abono.Descricao = input.Descricao;
        abono.MesReferencia = input.MesReferencia;
        abono.AnoReferencia = input.AnoReferencia;

        await db.SaveChangesAsync();
        return MapToOutput(abono);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var abono = await db.Abonos.FindAsync(id);
        if (abono is null) return false;
        db.Abonos.Remove(abono);
        await db.SaveChangesAsync();
        return true;
    }

    private static AbonoOutput MapToOutput(Abono a) => new()
    {
        Id = a.Id,
        ColaboradorId = a.ColaboradorId,
        ColaboradorNome = a.Colaborador?.Nome ?? string.Empty,
        Tipo = a.Tipo,
        TipoDescricao = a.Tipo.ToString(),
        Valor = a.Valor,
        Descricao = a.Descricao,
        MesReferencia = a.MesReferencia,
        AnoReferencia = a.AnoReferencia,
        Ativo = a.Ativo,
        CriadoEm = a.CriadoEm
    };
}
