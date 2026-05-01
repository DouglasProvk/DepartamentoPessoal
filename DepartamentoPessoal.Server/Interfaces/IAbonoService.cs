using CommonTemp.DTOs.Inputs.Abono;
using CommonTemp.DTOs.Outputs.Abono;

namespace DepartamentoPessoal.Server.Interfaces;

public interface IAbonoService
{
    Task<IEnumerable<AbonoOutput>> GetByColaboradorAsync(int colaboradorId);
    Task<IEnumerable<AbonoOutput>> GetByPeriodoAsync(int mes, int ano);
    Task<AbonoOutput?> GetByIdAsync(int id);
    Task<AbonoOutput> CreateAsync(AbonoInput input);
    Task<AbonoOutput?> UpdateAsync(int id, AbonoInput input);
    Task<bool> DeleteAsync(int id);
}
