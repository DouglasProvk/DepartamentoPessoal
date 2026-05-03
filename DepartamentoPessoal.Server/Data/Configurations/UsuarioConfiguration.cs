using CommonTemp.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DepartamentoPessoal.Server.Data.Configurations;

public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> builder)
    {
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Nome).HasMaxLength(200).IsRequired();
        builder.Property(u => u.Email).HasMaxLength(200).IsRequired();
        builder.Property(u => u.SenhaHash).IsRequired();
        builder.Property(u => u.Perfil).HasConversion<string>().HasMaxLength(30);
        builder.HasIndex(u => u.Email).IsUnique();

        builder.HasOne(u => u.Colaborador)
               .WithMany()
               .HasForeignKey(u => u.ColaboradorId)
               .OnDelete(DeleteBehavior.SetNull);
    }
}
