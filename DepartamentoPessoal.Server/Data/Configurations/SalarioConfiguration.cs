using CommonTemp.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DepartamentoPessoal.Server.Data.Configurations;

public class SalarioConfiguration : IEntityTypeConfiguration<Salario>
{
    public void Configure(EntityTypeBuilder<Salario> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.ValorBase).HasPrecision(18, 2).IsRequired();
        builder.Property(s => s.Inss).HasPrecision(18, 2);
        builder.Property(s => s.Fgts).HasPrecision(18, 2);
        builder.Property(s => s.Irrf).HasPrecision(18, 2);
        builder.Property(s => s.OutrosDescontos).HasPrecision(18, 2);
        builder.Property(s => s.OutrosAcrescimos).HasPrecision(18, 2);
        builder.Property(s => s.ValorLiquido).HasPrecision(18, 2);
        builder.Property(s => s.Observacao).HasMaxLength(500);

        builder.HasOne(s => s.Colaborador)
               .WithMany(c => c.Salarios)
               .HasForeignKey(s => s.ColaboradorId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
