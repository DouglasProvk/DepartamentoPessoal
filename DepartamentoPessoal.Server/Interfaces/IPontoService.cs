using CommonTemp.DTOs.Inputs.Ponto;
using CommonTemp.DTOs.Outputs.Ponto;

namespace DepartamentoPessoal.Server.Interfaces;

public interface IPontoService
{
    Task<IEnumerable<RegistroPontoOutput>> GetByColaboradorAsync(int colaboradorId, DateTime? inicio = null, DateTime? fim = null);
    Task<IEnumerable<PontoDiarioOutput>> GetEspelhoPontoAsync(int colaboradorId, int mes, int ano);
    Task<RegistroPontoOutput> RegistrarAsync(RegistroPontoInput input);
    Task<RegistroPontoOutput?> AprovarAsync(int id);
    Task<bool> DeleteAsync(int id);
}
