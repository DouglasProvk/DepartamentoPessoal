namespace DepartamentoPessoal.Server.Interfaces;

public interface IContrachequeService
{
    Task<byte[]?> GerarPdfAsync(int salarioId);
}
