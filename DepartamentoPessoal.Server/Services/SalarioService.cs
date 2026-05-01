using CommonTemp.DTOs.Inputs.Salario;
using CommonTemp.DTOs.Outputs.Salario;
using CommonTemp.Models;
using DepartamentoPessoal.Server.Data;
using DepartamentoPessoal.Server.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DepartamentoPessoal.Server.Services;

public class SalarioService(AppDbContext db) : ISalarioService
{
    private static decimal CalcularInss(decimal salario) => salario switch
    {
        <= 1412.00m => salario * 0.075m,
        <= 2666.68m => salario * 0.09m,
        <= 4000.03m => salario * 0.12m,
        <= 7786.02m => salario * 0.14m,
        _ => 908.86m
    };

    private static decimal CalcularIrrf(decimal baseCalculo) => baseCalculo switch
    {
        <= 2259.20m => 0m,
        <= 2826.65m => baseCalculo * 0.075m - 169.44m,
        <= 3751.05m => baseCalculo * 0.15m - 381.44m,
        <= 4664.68m => baseCalculo * 0.225m - 662.77m,
        _ => baseCalculo * 0.275m - 896.00m
    };

    public async Task<IEnumerable<SalarioOutput>> GetByColaboradorAsync(int colaboradorId)
    {
        return await db.Salarios
            .AsNoTracking()
            .Include(s => s.Colaborador)
            .Where(s => s.ColaboradorId == colaboradorId)
            .OrderByDescending(s => s.AnoReferencia)
            .ThenByDescending(s => s.MesReferencia)
            .Select(s => MapToOutput(s))
            .ToListAsync();
    }

    public async Task<SalarioOutput?> GetByIdAsync(int id)
    {
        var s = await db.Salarios.Include(x => x.Colaborador).AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return s is null ? null : MapToOutput(s);
    }

    public async Task<SalarioOutput> CreateAsync(SalarioInput input)
    {
        var inss = CalcularInss(input.ValorBase);
        var fgts = input.ValorBase * 0.08m;
        var irrf = CalcularIrrf(input.ValorBase - inss);
        var liquido = input.ValorBase - inss - irrf - input.OutrosDescontos + input.OutrosAcrescimos;

        var salario = new Salario
        {
            ColaboradorId = input.ColaboradorId,
            ValorBase = input.ValorBase,
            Inss = Math.Round(inss, 2),
            Fgts = Math.Round(fgts, 2),
            Irrf = Math.Round(irrf, 2),
            OutrosDescontos = input.OutrosDescontos,
            OutrosAcrescimos = input.OutrosAcrescimos,
            ValorLiquido = Math.Round(liquido, 2),
            MesReferencia = input.MesReferencia,
            AnoReferencia = input.AnoReferencia,
            DataPagamento = input.DataPagamento,
            Observacao = input.Observacao,
            Pago = false
        };

        db.Salarios.Add(salario);
        await db.SaveChangesAsync();
        await db.Entry(salario).Reference(s => s.Colaborador).LoadAsync();
        return MapToOutput(salario);
    }

    public async Task<SalarioOutput?> MarcarComoPagoAsync(int id)
    {
        var salario = await db.Salarios.Include(s => s.Colaborador).FirstOrDefaultAsync(s => s.Id == id);
        if (salario is null) return null;
        salario.Pago = true;
        await db.SaveChangesAsync();
        return MapToOutput(salario);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var salario = await db.Salarios.FindAsync(id);
        if (salario is null) return false;
        db.Salarios.Remove(salario);
        await db.SaveChangesAsync();
        return true;
    }

    private static SalarioOutput MapToOutput(Salario s) => new()
    {
        Id = s.Id,
        ColaboradorId = s.ColaboradorId,
        ColaboradorNome = s.Colaborador?.Nome ?? string.Empty,
        ValorBase = s.ValorBase,
        Inss = s.Inss,
        Fgts = s.Fgts,
        Irrf = s.Irrf,
        OutrosDescontos = s.OutrosDescontos,
        OutrosAcrescimos = s.OutrosAcrescimos,
        ValorLiquido = s.ValorLiquido,
        MesReferencia = s.MesReferencia,
        AnoReferencia = s.AnoReferencia,
        DataPagamento = s.DataPagamento,
        Pago = s.Pago,
        Observacao = s.Observacao,
        CriadoEm = s.CriadoEm
    };
}
