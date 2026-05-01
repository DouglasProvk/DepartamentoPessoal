using CommonTemp.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DepartamentoPessoal.Server.Data.Configurations;

public class RegistroPontoConfiguration : IEntityTypeConfiguration<RegistroPonto>
{
    public void Configure(EntityTypeBuilder<RegistroPonto> builder)
    {
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Tipo).HasConversion<string>().HasMaxLength(20);
        builder.Property(r => r.Ocorrencia).HasConversion<string>().HasMaxLength(30);
        builder.Property(r => r.Justificativa).HasMaxLength(500);

        builder.HasOne(r => r.Colaborador)
               .WithMany(c => c.RegistrosPonto)
               .HasForeignKey(r => r.ColaboradorId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
