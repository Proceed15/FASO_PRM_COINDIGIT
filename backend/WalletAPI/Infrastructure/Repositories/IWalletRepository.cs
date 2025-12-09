using WalletAPI.Domain.Entities;

namespace WalletAPI.Infrastructure.Repositories;

public interface IWalletRepository
{
    Task<UserWallet?> GetByUserIdAsync(int userId, CancellationToken ct = default);
    Task<UserWallet> UpsertItemAsync(int userId, string symbol, decimal amount, CancellationToken ct = default);
    Task<bool> RemoveItemAsync(int userId, string symbol, CancellationToken ct = default);
    
    Task<(WalletTransaction tx, decimal senderBalanceAfter, decimal receiverBalanceAfter)>
       TransferAsync(int fromUserId, int toUserId, string symbol, decimal amount, decimal? priceUsdAtTx, CancellationToken ct = default);
}