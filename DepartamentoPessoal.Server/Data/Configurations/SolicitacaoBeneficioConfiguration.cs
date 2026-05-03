using CommonTemp.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DepartamentoPessoal.Server.Data.Configurations;

public class SolicitacaoBeneficioConfiguration : IEntityTypeConfiguration<SolicitacaoBeneficio>
{
    public void Configure(EntityTypeBuilder<SolicitacaoBeneficio> builder)
    {
        builder.HasKey(s => s.Id);
        builder.Property(s => s.TipoBeneficio).HasConversion<string>().HasMaxLength(40);
        builder.Property(s => s.Descricao).HasMaxLength(1000).IsRequired();
        builder.Property(s => s.ObservacaoRH).HasMaxLength(1000);
        builder.Property(s => s.Status).HasConversion<string>().HasMaxLength(20);

        builder.HasOne(s => s.Colaborador)
               .WithMany()
               .HasForeignKey(s => s.ColaboradorId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
