using CommonTemp.DTOs.Inputs.Portal;
using CommonTemp.DTOs.Outputs.Portal;

namespace DepartamentoPessoal.Server.Interfaces;

public interface IMensagensRHService
{
    Task<IEnumerable<MensagemRHOutput>> GetAllMensagensAsync();
    Task<MensagemRHOutput?> ResponderAsync(int id, ResponderMensagemInput input);
    Task<IEnumerable<SolicitacaoBeneficioOutput>> GetAllSolicitacoesAsync();
    Task<SolicitacaoBeneficioOutput?> AtualizarSolicitacaoAsync(int id, AtualizarSolicitacaoInput input);
}
