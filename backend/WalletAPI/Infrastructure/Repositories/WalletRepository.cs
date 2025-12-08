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
}