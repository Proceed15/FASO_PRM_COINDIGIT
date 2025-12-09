using Microsoft.EntityFrameworkCore;
using WalletAPI.Domain.Entities;
using WalletAPI.Infrastructure.Data;

namespace WalletAPI.Infrastructure.Repositories
{
    public class WalletRepository : IWalletRepository
    {
        private readonly WalletDbContext _db;
        public WalletRepository(WalletDbContext db) => _db = db;

        public async Task<Wallet> CreateAsync(int userId, CancellationToken ct = default)
        {
            var wallet = new Wallet { UserId = userId };
            _db.Wallets.Add(wallet);
            await _db.SaveChangesAsync(ct);
            return wallet;
        }

        public Task<List<Wallet>> ListByUserAsync(int userId, CancellationToken ct = default) =>
            _db.Wallets.Where(w => w.UserId == userId)
                       .Include(w => w.Items)
                       .ToListAsync(ct);

        public Task<Wallet?> GetAsync(int userId, Guid walletId, CancellationToken ct = default) =>
            _db.Wallets.Where(w => w.UserId == userId && w.Id == walletId)
                       .Include(w => w.Items)
                       .FirstOrDefaultAsync(ct);

        public async Task<WalletItem> UpsertItemAsync(Guid walletId, string symbol, decimal amount, CancellationToken ct = default)
        {
            var sym = symbol.Trim().ToUpperInvariant();
            var item = await _db.WalletItems.FirstOrDefaultAsync(i => i.WalletId == walletId && i.Symbol == sym, ct);
            if (item is null)
            {
                item = new WalletItem { WalletId = walletId, Symbol = sym, Amount = amount };
                _db.WalletItems.Add(item);
            }
            else
            {
                item.Amount = amount;
            }
            await _db.SaveChangesAsync(ct);
            return item;
        }

        public async Task<bool> RemoveItemAsync(Guid walletId, string symbol, CancellationToken ct = default)
        {
            var sym = symbol.Trim().ToUpperInvariant();
            var item = await _db.WalletItems.FirstOrDefaultAsync(i => i.WalletId == walletId && i.Symbol == sym, ct);
            if (item is null) return false;
            _db.WalletItems.Remove(item);
            await _db.SaveChangesAsync(ct);
            return true;
        }

        // Transferência carteira única por usuário
        public async Task<(WalletTransaction tx, decimal senderBalanceAfter, decimal receiverBalanceAfter)> TransferAsync(int fromUserId, int toUserId, string symbol, decimal amount, decimal? priceUsdAtTx, CancellationToken ct = default)
        {
            using var txscope = await _db.Database.BeginTransactionAsync(ct);

            var normSymbol = symbol.Trim().ToUpperInvariant();

            var sender = await _db.Wallets.Include(w => w.Items).FirstOrDefaultAsync(w => w.UserId == fromUserId, ct)
                         ?? throw new InvalidOperationException("Carteira do remetente não existe.");
            var receiver = await _db.Wallets.Include(w => w.Items).FirstOrDefaultAsync(w => w.UserId == toUserId, ct);
            if (receiver is null)
            {
                receiver = (await _db.Wallets.AddAsync(new Wallet { UserId = toUserId }, ct)).Entity;
                await _db.SaveChangesAsync(ct);
                await _db.Entry(receiver).Collection(w => w.Items).LoadAsync(ct);
            }

            var sItem = sender.Items.FirstOrDefault(i => i.Symbol == normSymbol)
                        ?? throw new InvalidOperationException("Remetente não possui o ativo.");
            if (sItem.Amount < amount) throw new InvalidOperationException("Saldo insuficiente.");

            sItem.Amount -= amount;
            if (sItem.Amount == 0) _db.WalletItems.Remove(sItem);
            sender.UpdatedAt = DateTime.UtcNow;

            var rItem = receiver.Items.FirstOrDefault(i => i.Symbol == normSymbol);
            if (rItem is null)
                _db.WalletItems.Add(new WalletItem { WalletId = receiver.Id, Symbol = normSymbol, Amount = amount });
            else
                rItem.Amount += amount;
            receiver.UpdatedAt = DateTime.UtcNow;

            var tx = new WalletTransaction
            {
                WalletId = sender.Id,
                TargetWalletId = receiver.Id,
                FromUserId = fromUserId,
                ToUserId = toUserId,
                Symbol = normSymbol,
                Amount = amount,
                PriceUsdAtTx = priceUsdAtTx,
                TotalUsdAtTx = priceUsdAtTx.HasValue ? priceUsdAtTx * amount : null
            };
            _db.Transactions.Add(tx);

            await _db.SaveChangesAsync(ct);
            await txscope.CommitAsync(ct);

            var senderBal = sender.Items.FirstOrDefault(i => i.Symbol == normSymbol)?.Amount ?? 0m;
            var receiverBal = (await _db.WalletItems
                                .Where(i => i.WalletId == receiver.Id && i.Symbol == normSymbol)
                                .FirstOrDefaultAsync(ct))?.Amount ?? 0m;

            return (tx, senderBal, receiverBal);
        }

        // Transferência entre carteiras específicas
        public async Task<(WalletTransaction tx, decimal senderBalanceAfter, decimal receiverBalanceAfter)> TransferAsync(int fromUserId, Guid fromWalletId, int toUserId, Guid toWalletId, string symbol, decimal amount, decimal? priceUsdAtTx, CancellationToken ct = default)
        {
            using var txscope = await _db.Database.BeginTransactionAsync(ct);

            var normSymbol = symbol.Trim().ToUpperInvariant();

            var sender = await _db.Wallets.Include(w => w.Items)
                            .FirstOrDefaultAsync(w => w.UserId == fromUserId && w.Id == fromWalletId, ct)
                         ?? throw new InvalidOperationException("Carteira do remetente não existe.");
            var receiver = await _db.Wallets.Include(w => w.Items)
                            .FirstOrDefaultAsync(w => w.UserId == toUserId && w.Id == toWalletId, ct)
                         ?? throw new InvalidOperationException("Carteira do destinatário não existe.");

            var sItem = sender.Items.FirstOrDefault(i => i.Symbol == normSymbol)
                        ?? throw new InvalidOperationException("Remetente não possui o ativo.");
            if (sItem.Amount < amount) throw new InvalidOperationException("Saldo insuficiente.");

            sItem.Amount -= amount;
            if (sItem.Amount == 0) _db.WalletItems.Remove(sItem);
            sender.UpdatedAt = DateTime.UtcNow;

            var rItem = receiver.Items.FirstOrDefault(i => i.Symbol == normSymbol);
            if (rItem is null)
                _db.WalletItems.Add(new WalletItem { WalletId = receiver.Id, Symbol = normSymbol, Amount = amount });
            else
                rItem.Amount += amount;
            receiver.UpdatedAt = DateTime.UtcNow;

            var tx = new WalletTransaction
            {
                WalletId = sender.Id,
                TargetWalletId = receiver.Id,
                FromUserId = fromUserId,
                ToUserId = toUserId,
                Symbol = normSymbol,
                Amount = amount,
                PriceUsdAtTx = priceUsdAtTx,
                TotalUsdAtTx = priceUsdAtTx.HasValue ? priceUsdAtTx * amount : null
            };
            _db.Transactions.Add(tx);

            await _db.SaveChangesAsync(ct);
            await txscope.CommitAsync(ct);

            var senderBal = sender.Items.FirstOrDefault(i => i.Symbol == normSymbol)?.Amount ?? 0m;
            var receiverBal = (await _db.WalletItems
                                .Where(i => i.WalletId == receiver.Id && i.Symbol == normSymbol)
                                .FirstOrDefaultAsync(ct))?.Amount ?? 0m;

            return (tx, senderBal, receiverBal);
        }
    }
}