using CommonTemp.DTOs.Inputs.Salario;
using CommonTemp.DTOs.Outputs.Salario;

namespace DepartamentoPessoal.Server.Interfaces;

public interface ISalarioService
{
    Task<IEnumerable<SalarioOutput>> GetByColaboradorAsync(int colaboradorId);
    Task<SalarioOutput?> GetByIdAsync(int id);
    Task<SalarioOutput> CreateAsync(SalarioInput input);
    Task<SalarioOutput?> MarcarComoPagoAsync(int id);
    Task<bool> DeleteAsync(int id);
}
