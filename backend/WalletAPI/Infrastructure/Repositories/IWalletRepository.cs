using WalletAPI.Domain.Entities;

namespace WalletAPI.Infrastructure.Repositories
{
    public interface IWalletRepository
    {
        Task<Wallet> CreateAsync(int userId, CancellationToken ct = default);
        Task<List<Wallet>> ListByUserAsync(int userId, CancellationToken ct = default);
        Task<Wallet?> GetAsync(int userId, Guid walletId, CancellationToken ct = default);
        Task<WalletItem> UpsertItemAsync(Guid walletId, string symbol, decimal amount, CancellationToken ct = default);
        Task<bool> RemoveItemAsync(Guid walletId, string symbol, CancellationToken ct = default);

        // Transferência entre carteiras padrão dos usuários (Caso nao especifique carteiras)
        Task<(WalletTransaction tx, decimal senderBalanceAfter, decimal receiverBalanceAfter)>
            TransferAsync(int fromUserId, int toUserId, string symbol, decimal amount, decimal? priceUsdAtTx, CancellationToken ct = default);

        // Transferência entre carteiras específicas do remetente e do destinatário
        Task<(WalletTransaction tx, decimal senderBalanceAfter, decimal receiverBalanceAfter)>
            TransferAsync(int fromUserId, Guid fromWalletId, int toUserId, Guid toWalletId, string symbol, decimal amount, decimal? priceUsdAtTx, CancellationToken ct = default);
    }
}