using CommonTemp.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DepartamentoPessoal.Server.Data.Configurations;

public class AbonoConfiguration : IEntityTypeConfiguration<Abono>
{
    public void Configure(EntityTypeBuilder<Abono> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(a => a.Valor).HasPrecision(18, 2).IsRequired();
        builder.Property(a => a.Descricao).HasMaxLength(500);
        builder.Property(a => a.Tipo).HasConversion<string>().HasMaxLength(30);

        builder.HasOne(a => a.Colaborador)
               .WithMany(c => c.Abonos)
               .HasForeignKey(a => a.ColaboradorId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
