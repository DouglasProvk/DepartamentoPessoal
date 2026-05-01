using CommonTemp.DTOs.Inputs.Colaborador;
using CommonTemp.DTOs.Outputs.Colaborador;

namespace DepartamentoPessoal.Server.Interfaces;

public interface IColaboradorService
{
    Task<IEnumerable<ColaboradorListOutput>> GetAllAsync();
    Task<ColaboradorOutput?> GetByIdAsync(int id);
    Task<ColaboradorOutput> CreateAsync(ColaboradorInput input);
    Task<ColaboradorOutput?> UpdateAsync(int id, ColaboradorInput input);
    Task<bool> DeleteAsync(int id);
    Task<bool> InativarAsync(int id);
}
