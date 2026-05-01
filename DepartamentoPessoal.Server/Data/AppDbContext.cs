using CommonTemp.Models;
using Microsoft.EntityFrameworkCore;

namespace DepartamentoPessoal.Server.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Colaborador> Colaboradores { get; set; }
    public DbSet<Salario> Salarios { get; set; }
    public DbSet<Abono> Abonos { get; set; }
    public DbSet<RegistroPonto> RegistrosPonto { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
