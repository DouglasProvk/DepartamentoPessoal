using CommonTemp.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DepartamentoPessoal.Server.Data.Configurations;

public class ColaboradorConfiguration : IEntityTypeConfiguration<Colaborador>
{
    public void Configure(EntityTypeBuilder<Colaborador> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Nome).HasMaxLength(200).IsRequired();
        builder.Property(c => c.CPF).HasMaxLength(14).IsRequired();
        builder.Property(c => c.RG).HasMaxLength(20);
        builder.Property(c => c.Email).HasMaxLength(200);
        builder.Property(c => c.Telefone).HasMaxLength(20);
        builder.Property(c => c.Cargo).HasMaxLength(100).IsRequired();
        builder.Property(c => c.Departamento).HasMaxLength(100).IsRequired();
        builder.Property(c => c.Matricula).HasMaxLength(20);

        builder.Property(c => c.Logradouro).HasMaxLength(200);
        builder.Property(c => c.Numero).HasMaxLength(10);
        builder.Property(c => c.Complemento).HasMaxLength(100);
        builder.Property(c => c.Bairro).HasMaxLength(100);
        builder.Property(c => c.Cidade).HasMaxLength(100);
        builder.Property(c => c.Estado).HasMaxLength(2);
        builder.Property(c => c.CEP).HasMaxLength(9);

        builder.Property(c => c.Banco).HasMaxLength(100);
        builder.Property(c => c.Agencia).HasMaxLength(20);
        builder.Property(c => c.ContaBancaria).HasMaxLength(20);

        builder.Property(c => c.Status).HasConversion<string>().HasMaxLength(20);
        builder.Property(c => c.TipoContrato).HasConversion<string>().HasMaxLength(20);

        builder.HasIndex(c => c.CPF).IsUnique();
        builder.HasIndex(c => c.Matricula).IsUnique();
    }
}
