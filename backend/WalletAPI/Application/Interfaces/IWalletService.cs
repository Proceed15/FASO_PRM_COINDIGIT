using WalletAPI.Application.Models;

namespace WalletAPI.Application.Interfaces;

public interface IWalletService
{
    Task<WalletSummaryDto?> GetWalletAsync(int userId, CancellationToken ct = default);
    Task<WalletSummaryDto> UpsertWalletItemAsync(int userId, WalletItemUpsertDto upsert, CancellationToken ct = default);
    Task<bool> RemoveWalletItemAsync(int userId, string symbol, CancellationToken ct = default);
}