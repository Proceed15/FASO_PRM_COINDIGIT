using WalletAPI.Application.Interfaces;
using WalletAPI.Application.Models;
using WalletAPI.Infrastructure.External;
using WalletAPI.Infrastructure.Repositories;

namespace WalletAPI.Application.Services;

public class WalletService : IWalletService
{
    private readonly IWalletRepository _repo;
    private readonly ICurrencyPriceClient _prices;

    public WalletService(IWalletRepository repo, ICurrencyPriceClient prices)
    {
        _repo = repo;
        _prices = prices;
    }

    public async Task<WalletSummaryDto?> GetWalletAsync(int userId, CancellationToken ct = default)
    {
        var wallet = await _repo.GetByUserIdAsync(userId, ct);
        if (wallet is null) return null;

        var itemsDto = new List<WalletItemDto>();
        decimal totalUsd = 0m;

        foreach (var item in wallet.Items)
        {
            var last = await _prices.GetLastPriceUsdAsync(item.Symbol, ct);
            decimal? itemTotal = last.HasValue ? last.Value * item.Amount : null;
            if (itemTotal.HasValue) totalUsd += itemTotal.Value;

            itemsDto.Add(new WalletItemDto(item.Symbol, item.Amount, last, itemTotal));
        }

        return new WalletSummaryDto(wallet.UserId, itemsDto, totalUsd);
    }

    public async Task<WalletSummaryDto> UpsertWalletItemAsync(int userId, WalletItemUpsertDto upsert, CancellationToken ct = default)
    {
        var updated = await _repo.UpsertItemAsync(userId, upsert.Symbol, upsert.Amount, ct);
        var itemsDto = new List<WalletItemDto>();
        decimal totalUsd = 0m;

        foreach (var item in updated.Items)
        {
            var last = await _prices.GetLastPriceUsdAsync(item.Symbol, ct);
            decimal? itemTotal = last.HasValue ? last.Value * item.Amount : null;
            if (itemTotal.HasValue) totalUsd += itemTotal.Value;

            itemsDto.Add(new WalletItemDto(item.Symbol, item.Amount, last, itemTotal));
        }

        return new WalletSummaryDto(updated.UserId, itemsDto, totalUsd);
    }

    public async Task<bool> RemoveWalletItemAsync(int userId, string symbol, CancellationToken ct = default)
    {
        return await _repo.RemoveItemAsync(userId, symbol, ct);
    }
}