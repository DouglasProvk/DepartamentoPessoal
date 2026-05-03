using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CommonTemp.DTOs.Inputs.Auth;
using CommonTemp.DTOs.Outputs.Auth;
using DepartamentoPessoal.Server.Data;
using DepartamentoPessoal.Server.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace DepartamentoPessoal.Server.Services;

public class AuthService(AppDbContext db, IConfiguration config) : IAuthService
{
    public async Task<LoginOutput?> LoginAsync(LoginInput input)
    {
        var usuario = await db.Usuarios
            .FirstOrDefaultAsync(u => u.Email == input.Email && u.Ativo);

        if (usuario is null || !BCrypt.Net.BCrypt.Verify(input.Senha, usuario.SenhaHash))
            return null;

        usuario.UltimoAcessoEm = DateTime.UtcNow;
        await db.SaveChangesAsync();

        var expiracao = DateTime.UtcNow.AddHours(config.GetValue<int>("Jwt:ExpiracaoHoras"));
        var token = GerarToken(usuario.Id, usuario.Nome, usuario.Email, usuario.Perfil.ToString(), usuario.ColaboradorId, expiracao);

        return new LoginOutput
        {
            Token = token,
            Nome = usuario.Nome,
            Email = usuario.Email,
            Perfil = usuario.Perfil.ToString(),
            ColaboradorId = usuario.ColaboradorId,
            Expiracao = expiracao
        };
    }

    private string GerarToken(int id, string nome, string email, string perfil, int? colaboradorId, DateTime expiracao)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim(ClaimTypes.Name, nome),
            new Claim(ClaimTypes.Role, perfil),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        if (colaboradorId.HasValue)
            claims.Add(new Claim("colaboradorId", colaboradorId.Value.ToString()));

        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: expiracao,
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
