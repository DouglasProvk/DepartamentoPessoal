using CommonTemp.DTOs.Inputs.Usuario;
using CommonTemp.DTOs.Outputs.Usuario;
using CommonTemp.Models;
using DepartamentoPessoal.Server.Data;
using DepartamentoPessoal.Server.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DepartamentoPessoal.Server.Services;

public class UsuarioService(AppDbContext db) : IUsuarioService
{
    public async Task<IEnumerable<UsuarioOutput>> GetAllAsync()
    {
        return await db.Usuarios
            .AsNoTracking()
            .OrderBy(u => u.Nome)
            .Select(u => MapToOutput(u))
            .ToListAsync();
    }

    public async Task<UsuarioOutput?> GetByIdAsync(int id)
    {
        var u = await db.Usuarios.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return u is null ? null : MapToOutput(u);
    }

    public async Task<UsuarioOutput> CreateAsync(UsuarioInput input)
    {
        var usuario = new Usuario
        {
            Nome = input.Nome,
            Email = input.Email.ToLower().Trim(),
            SenhaHash = BCrypt.Net.BCrypt.HashPassword(input.Senha),
            Perfil = input.Perfil,
            Ativo = true
        };

        db.Usuarios.Add(usuario);
        await db.SaveChangesAsync();
        return MapToOutput(usuario);
    }

    public async Task<UsuarioOutput?> UpdateAsync(int id, UsuarioInput input)
    {
        var usuario = await db.Usuarios.FindAsync(id);
        if (usuario is null) return null;

        usuario.Nome = input.Nome;
        usuario.Email = input.Email.ToLower().Trim();
        usuario.Perfil = input.Perfil;

        if (!string.IsNullOrWhiteSpace(input.Senha))
            usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(input.Senha);

        await db.SaveChangesAsync();
        return MapToOutput(usuario);
    }

    public async Task<bool> AlterarSenhaAsync(int id, AlterarSenhaInput input)
    {
        var usuario = await db.Usuarios.FindAsync(id);
        if (usuario is null) return false;
        if (!BCrypt.Net.BCrypt.Verify(input.SenhaAtual, usuario.SenhaHash)) return false;

        usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(input.NovaSenha);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ToggleAtivoAsync(int id)
    {
        var usuario = await db.Usuarios.FindAsync(id);
        if (usuario is null) return false;
        usuario.Ativo = !usuario.Ativo;
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var usuario = await db.Usuarios.FindAsync(id);
        if (usuario is null) return false;
        db.Usuarios.Remove(usuario);
        await db.SaveChangesAsync();
        return true;
    }

    private static UsuarioOutput MapToOutput(Usuario u) => new()
    {
        Id = u.Id,
        Nome = u.Nome,
        Email = u.Email,
        Perfil = u.Perfil,
        PerfilDescricao = u.Perfil.ToString(),
        Ativo = u.Ativo,
        CriadoEm = u.CriadoEm,
        UltimoAcessoEm = u.UltimoAcessoEm
    };
}
