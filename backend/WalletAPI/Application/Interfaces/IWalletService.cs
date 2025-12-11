using WalletAPI.Application.Models;

namespace WalletAPI.Application.Interfaces
{
    public interface IWalletService
    {
        Task<CreateWalletResponseDto> CreateWalletAsync(int userId, CancellationToken ct = default);
        Task<List<WalletSummaryDto>> ListWalletsAsync(int userId, CancellationToken ct = default);
        Task<WalletSummaryDto?> GetWalletAsync(int userId, Guid walletId, CancellationToken ct = default);
        Task<WalletSummaryDto?> UpsertWalletItemAsync(int userId, Guid walletId, WalletItemUpsertDto dto, CancellationToken ct = default);
        Task<bool> RemoveWalletItemAsync(int userId, Guid walletId, string symbol, CancellationToken ct = default);
        Task<TransferResultDto> TransferAsync(TransferRequestDto request, CancellationToken ct = default);
    }
}