using Microsoft.EntityFrameworkCore;
using WalletAPI.Domain.Entities;
using WalletAPI.Infrastructure.Data;

namespace WalletAPI.Infrastructure.Repositories;

public class WalletRepository : IWalletRepository
{
    private readonly WalletDbContext _db;
    public WalletRepository(WalletDbContext db) => _db = db;

    public async Task<UserWallet?> GetByUserIdAsync(int userId, CancellationToken ct = default)
    {
        return await _db.Wallets
            .Include(w => w.Items)
            .FirstOrDefaultAsync(w => w.UserId == userId, ct);
    }

    public async Task<UserWallet> UpsertItemAsync(int userId, string symbol, decimal amount, CancellationToken ct = default)
    {
        var wallet = await _db.Wallets
            .Include(w => w.Items)
            .FirstOrDefaultAsync(w => w.UserId == userId, ct);

        if (wallet is null)
        {
            wallet = new UserWallet { UserId = userId };
            _db.Wallets.Add(wallet);
            await _db.SaveChangesAsync(ct);
            await _db.Entry(wallet).Collection(w => w.Items).LoadAsync(ct);
        }

        var normSymbol = symbol.Trim().ToUpperInvariant();
        var item = wallet.Items.FirstOrDefault(i => i.Symbol == normSymbol);

        if (item is null)
        {
            item = new WalletItem
            {
                UserWalletId = wallet.Id,
                Symbol = normSymbol,
                Amount = amount
            };
            _db.WalletItems.Add(item);
        }
        else
        {
            item.Amount = amount;
        }

        wallet.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        return await _db.Wallets
            .Include(w => w.Items)
            .FirstAsync(w => w.Id == wallet.Id, ct);
    }

    public async Task<bool> RemoveItemAsync(int userId, string symbol, CancellationToken ct = default)
    {
        var wallet = await _db.Wallets
            .Include(w => w.Items)
            .FirstOrDefaultAsync(w => w.UserId == userId, ct);
        if (wallet is null) return false;

        var normSymbol = symbol.Trim().ToUpperInvariant();
        var item = wallet.Items.FirstOrDefault(i => i.Symbol == normSymbol);
        if (item is null) return false;

        _db.WalletItems.Remove(item);
        wallet.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<(WalletTransaction tx, decimal senderBalanceAfter, decimal receiverBalanceAfter)>
        TransferAsync(int fromUserId, int toUserId, string symbol, decimal amount, decimal? priceUsdAtTx, CancellationToken ct = default)
    {
        using var txscope = await _db.Database.BeginTransactionAsync(ct);

        var normSymbol = symbol.Trim().ToUpperInvariant();

        // Carrega carteiras
        var sender = await _db.Wallets.Include(w => w.Items).FirstOrDefaultAsync(w => w.UserId == fromUserId, ct)
                     ?? throw new InvalidOperationException("Carteira do remetente não existe.");
        var receiver = await _db.Wallets.Include(w => w.Items).FirstOrDefaultAsync(w => w.UserId == toUserId, ct);
        if (receiver is null)
        {
            receiver = (await _db.Wallets.AddAsync(new UserWallet { UserId = toUserId }, ct)).Entity;
            await _db.SaveChangesAsync(ct);
            await _db.Entry(receiver).Collection(w => w.Items).LoadAsync(ct);
        }

        // Verifica saldo remetente
        var sItem = sender.Items.FirstOrDefault(i => i.Symbol == normSymbol)
                    ?? throw new InvalidOperationException("Remetente não possui o ativo.");
        if (sItem.Amount < amount) throw new InvalidOperationException("Saldo insuficiente.");

        // Debita remetente
        sItem.Amount -= amount;
        if (sItem.Amount == 0) _db.WalletItems.Remove(sItem);
        sender.UpdatedAt = DateTime.UtcNow;

        // Credita destinatário
        var rItem = receiver.Items.FirstOrDefault(i => i.Symbol == normSymbol);
        if (rItem is null)
            _db.WalletItems.Add(new WalletItem { UserWalletId = receiver.Id, Symbol = normSymbol, Amount = amount });
        else
            rItem.Amount += amount;
        receiver.UpdatedAt = DateTime.UtcNow;

        // Registra transação
        var tx = new WalletTransaction
        {
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
        var receiverBal = (await _db.WalletItems.Where(i => i.UserWalletId == receiver.Id && i.Symbol == normSymbol).FirstOrDefaultAsync(ct))?.Amount ?? 0m;

        return (tx, senderBal, receiverBal);
    }
}