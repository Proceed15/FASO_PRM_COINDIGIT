using WalletAPI.Application.Interfaces;
using WalletAPI.Application.Models;
using WalletAPI.Infrastructure.External;
using WalletAPI.Infrastructure.Repositories;
using WalletAPI.Domain.Entities;

namespace WalletAPI.Application.Services;

public class WalletService : IWalletService
{
    private readonly IWalletRepository _repo;
    private readonly ICurrencyPriceClient _prices;
    private readonly IUserClient _users;

    public WalletService(IWalletRepository repo, ICurrencyPriceClient prices, IUserClient users)
    {
        _repo = repo;
        _prices = prices;
        _users = users;
    }

    public async Task<CreateWalletResponseDto> CreateWalletAsync(int userId, CancellationToken ct = default)
    {
        if (!await _users.ExistsAsync(userId, ct))
            throw new InvalidOperationException("Usuário não existe.");

        var wallet = await _repo.CreateAsync(userId, ct);
        return new CreateWalletResponseDto
        {
            WalletId = wallet.Id,
            UserId = userId,
            CreatedAt = wallet.CreatedAt
        };
    }

    // Listar todas as carteiras de um usuário
    public async Task<List<WalletSummaryDto>> ListWalletsAsync(int userId, CancellationToken ct = default)
    {
        if (!await _users.ExistsAsync(userId, ct))
            throw new InvalidOperationException("Usuário não existe.");

        var wallets = await _repo.ListByUserAsync(userId, ct);
        var results = new List<WalletSummaryDto>();

        foreach (var w in wallets)
        {
            var dto = new WalletSummaryDto { WalletId = w.Id, UserId = w.UserId };
            decimal? total = 0m;

            foreach (var it in w.Items)
            {
                var price = await _prices.GetLastPriceUsdAsync(it.Symbol, ct);
                var itemTotal = (price is null) ? (decimal?)null : it.Amount * price.Value;

                dto.Items.Add(new WalletItemDto
                {
                    Symbol = it.Symbol,
                    Amount = it.Amount,
                    LastPriceUsd = price,
                    TotalUsd = itemTotal
                });

                if (itemTotal is not null) total += itemTotal.Value;
                else total = null;
            }

            dto.TotalUsd = total;
            results.Add(dto);
        }

        return results;
    }

    // Obter carteira específica por walletId
    public async Task<WalletSummaryDto?> GetWalletAsync(int userId, Guid walletId, CancellationToken ct = default)
    {
        if (!await _users.ExistsAsync(userId, ct)) return null;
        var wallet = await _repo.GetAsync(userId, walletId, ct);
        if (wallet is null) return null;

        var dto = new WalletSummaryDto { WalletId = wallet.Id, UserId = wallet.UserId };
        decimal? total = 0m;

        foreach (var it in wallet.Items)
        {
            var price = await _prices.GetLastPriceUsdAsync(it.Symbol, ct);
            var itemTotal = (price is null) ? (decimal?)null : it.Amount * price.Value;

            dto.Items.Add(new WalletItemDto
            {
                Symbol = it.Symbol,
                Amount = it.Amount,
                LastPriceUsd = price,
                TotalUsd = itemTotal
            });

            if (itemTotal is not null) total += itemTotal.Value;
            else total = null;
        }

        dto.TotalUsd = total;
        return dto;
    }

    public async Task<WalletSummaryDto?> UpsertWalletItemAsync(int userId, Guid walletId, WalletItemUpsertDto dto, CancellationToken ct = default)
    {
        if (!await _users.ExistsAsync(userId, ct)) return null;

        if (string.IsNullOrWhiteSpace(dto.Symbol)) throw new ArgumentException("Símbolo é obrigatório.");
        if (dto.Amount < 0) throw new ArgumentException("Quantidade deve ser maior ou igual a 0.");

        var wallet = await _repo.GetAsync(userId, walletId, ct);
        if (wallet is null) return null;

        await _repo.UpsertItemAsync(walletId, dto.Symbol, dto.Amount, ct);
        return await GetWalletAsync(userId, walletId, ct);
    }

    public async Task<bool> RemoveWalletItemAsync(int userId, Guid walletId, string symbol, CancellationToken ct = default)
    {
        if (!await _users.ExistsAsync(userId, ct)) return false;

        var wallet = await _repo.GetAsync(userId, walletId, ct);
        if (wallet is null) return false;

        return await _repo.RemoveItemAsync(walletId, symbol, ct);
    }

    public async Task<TransferResultDto> TransferAsync(TransferRequestDto dto, CancellationToken ct = default)
    {
        if (!await _users.ExistsAsync(dto.FromUserId, ct)) throw new InvalidOperationException("Remetente não existe.");
        if (!await _users.ExistsAsync(dto.ToUserId, ct)) throw new InvalidOperationException("Destinatário não existe.");

        var price = await _prices.GetLastPriceUsdAsync(dto.Symbol, ct);

        (WalletTransaction tx, decimal sAfter, decimal rAfter) result;

        if (dto.FromWalletId.HasValue && dto.ToWalletId.HasValue)
        {
            result = await _repo.TransferAsync(dto.FromUserId, dto.FromWalletId.Value, dto.ToUserId, dto.ToWalletId.Value, dto.Symbol, dto.Amount, price, ct);
        }
        else
        {
            result = await _repo.TransferAsync(dto.FromUserId, dto.ToUserId, dto.Symbol, dto.Amount, price, ct);
        }

        return new TransferResultDto
        {
            Symbol = dto.Symbol,
            Amount = dto.Amount,
            SenderBalanceAfter = result.sAfter,
            ReceiverBalanceAfter = result.rAfter,
            PriceUsdAtTx = price,
            TotalUsdAtTx = price.HasValue ? price * dto.Amount : null
        };
    }
}