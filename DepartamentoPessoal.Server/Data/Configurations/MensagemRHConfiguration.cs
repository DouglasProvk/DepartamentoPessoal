using CommonTemp.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DepartamentoPessoal.Server.Data.Configurations;

public class MensagemRHConfiguration : IEntityTypeConfiguration<MensagemRH>
{
    public void Configure(EntityTypeBuilder<MensagemRH> builder)
    {
        builder.HasKey(m => m.Id);
        builder.Property(m => m.Assunto).HasMaxLength(200).IsRequired();
        builder.Property(m => m.Mensagem).HasMaxLength(2000).IsRequired();
        builder.Property(m => m.Resposta).HasMaxLength(2000);
        builder.Property(m => m.Status).HasConversion<string>().HasMaxLength(20);

        builder.HasOne(m => m.Colaborador)
               .WithMany()
               .HasForeignKey(m => m.ColaboradorId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
