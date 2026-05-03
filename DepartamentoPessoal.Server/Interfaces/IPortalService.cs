using CommonTemp.DTOs.Inputs.Portal;
using CommonTemp.DTOs.Outputs.Portal;
using CommonTemp.DTOs.Outputs.Salario;
using CommonTemp.DTOs.Outputs.Abono;
using CommonTemp.DTOs.Outputs.Colaborador;

namespace DepartamentoPessoal.Server.Interfaces;

public interface IPortalService
{
    Task<ColaboradorOutput?> GetMeAsync(int colaboradorId);
    Task<IEnumerable<SalarioOutput>> GetMeusContracheques(int colaboradorId);
    Task<IEnumerable<AbonoOutput>> GetMeusBeneficiosAsync(int colaboradorId);
    Task<IEnumerable<MensagemRHOutput>> GetMinhasMensagensAsync(int colaboradorId);
    Task<MensagemRHOutput> EnviarMensagemAsync(int colaboradorId, MensagemRHInput input);
    Task<IEnumerable<SolicitacaoBeneficioOutput>> GetMinhasSolicitacoesAsync(int colaboradorId);
    Task<SolicitacaoBeneficioOutput> CriarSolicitacaoAsync(int colaboradorId, SolicitacaoBeneficioInput input);
}
