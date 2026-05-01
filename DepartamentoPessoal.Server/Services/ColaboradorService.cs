using CommonTemp.DTOs.Inputs.Colaborador;
using CommonTemp.DTOs.Outputs.Colaborador;
using CommonTemp.Enums;
using CommonTemp.Models;
using DepartamentoPessoal.Server.Data;
using DepartamentoPessoal.Server.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DepartamentoPessoal.Server.Services;

public class ColaboradorService(AppDbContext db) : IColaboradorService
{
    public async Task<IEnumerable<ColaboradorListOutput>> GetAllAsync()
    {
        return await db.Colaboradores
            .AsNoTracking()
            .OrderBy(c => c.Nome)
            .Select(c => new ColaboradorListOutput
            {
                Id = c.Id,
                Nome = c.Nome,
                CPF = c.CPF,
                Cargo = c.Cargo,
                Departamento = c.Departamento,
                Status = c.Status.ToString(),
                TipoContrato = c.TipoContrato.ToString(),
                DataAdmissao = c.DataAdmissao,
                Matricula = c.Matricula
            })
            .ToListAsync();
    }

    public async Task<ColaboradorOutput?> GetByIdAsync(int id)
    {
        var c = await db.Colaboradores.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return c is null ? null : MapToOutput(c);
    }

    public async Task<ColaboradorOutput> CreateAsync(ColaboradorInput input)
    {
        var colaborador = new Colaborador
        {
            Nome = input.Nome,
            CPF = input.CPF.Replace(".", "").Replace("-", ""),
            RG = input.RG,
            DataNascimento = input.DataNascimento,
            Email = input.Email,
            Telefone = input.Telefone,
            Cargo = input.Cargo,
            Departamento = input.Departamento,
            DataAdmissao = input.DataAdmissao,
            TipoContrato = input.TipoContrato,
            Status = StatusColaborador.Ativo,
            Matricula = await GerarMatriculaAsync(),
            Logradouro = input.Logradouro,
            Numero = input.Numero,
            Complemento = input.Complemento,
            Bairro = input.Bairro,
            Cidade = input.Cidade,
            Estado = input.Estado,
            CEP = input.CEP,
            Banco = input.Banco,
            Agencia = input.Agencia,
            ContaBancaria = input.ContaBancaria
        };

        db.Colaboradores.Add(colaborador);
        await db.SaveChangesAsync();
        return MapToOutput(colaborador);
    }

    public async Task<ColaboradorOutput?> UpdateAsync(int id, ColaboradorInput input)
    {
        var colaborador = await db.Colaboradores.FindAsync(id);
        if (colaborador is null) return null;

        colaborador.Nome = input.Nome;
        colaborador.CPF = input.CPF.Replace(".", "").Replace("-", "");
        colaborador.RG = input.RG;
        colaborador.DataNascimento = input.DataNascimento;
        colaborador.Email = input.Email;
        colaborador.Telefone = input.Telefone;
        colaborador.Cargo = input.Cargo;
        colaborador.Departamento = input.Departamento;
        colaborador.DataAdmissao = input.DataAdmissao;
        colaborador.TipoContrato = input.TipoContrato;
        colaborador.Logradouro = input.Logradouro;
        colaborador.Numero = input.Numero;
        colaborador.Complemento = input.Complemento;
        colaborador.Bairro = input.Bairro;
        colaborador.Cidade = input.Cidade;
        colaborador.Estado = input.Estado;
        colaborador.CEP = input.CEP;
        colaborador.Banco = input.Banco;
        colaborador.Agencia = input.Agencia;
        colaborador.ContaBancaria = input.ContaBancaria;
        colaborador.AtualizadoEm = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return MapToOutput(colaborador);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var colaborador = await db.Colaboradores.FindAsync(id);
        if (colaborador is null) return false;
        db.Colaboradores.Remove(colaborador);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> InativarAsync(int id)
    {
        var colaborador = await db.Colaboradores.FindAsync(id);
        if (colaborador is null) return false;
        colaborador.Status = StatusColaborador.Inativo;
        colaborador.AtualizadoEm = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return true;
    }

    private async Task<string> GerarMatriculaAsync()
    {
        var ultimo = await db.Colaboradores
            .OrderByDescending(c => c.Id)
            .Select(c => c.Matricula)
            .FirstOrDefaultAsync();

        if (ultimo is null) return "COL0001";
        if (int.TryParse(ultimo[3..], out int num))
            return $"COL{(num + 1):D4}";
        return $"COL{(await db.Colaboradores.CountAsync() + 1):D4}";
    }

    private static ColaboradorOutput MapToOutput(Colaborador c) => new()
    {
        Id = c.Id,
        Nome = c.Nome,
        CPF = c.CPF,
        RG = c.RG,
        DataNascimento = c.DataNascimento,
        Email = c.Email,
        Telefone = c.Telefone,
        Cargo = c.Cargo,
        Departamento = c.Departamento,
        DataAdmissao = c.DataAdmissao,
        DataDemissao = c.DataDemissao,
        TipoContrato = c.TipoContrato.ToString(),
        Status = c.Status.ToString(),
        Matricula = c.Matricula,
        Logradouro = c.Logradouro,
        Numero = c.Numero,
        Complemento = c.Complemento,
        Bairro = c.Bairro,
        Cidade = c.Cidade,
        Estado = c.Estado,
        CEP = c.CEP,
        Banco = c.Banco,
        Agencia = c.Agencia,
        ContaBancaria = c.ContaBancaria,
        CriadoEm = c.CriadoEm,
        AtualizadoEm = c.AtualizadoEm
    };
}
