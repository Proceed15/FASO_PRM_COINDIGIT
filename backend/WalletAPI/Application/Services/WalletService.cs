using WalletAPI.Application.Interfaces;
using WalletAPI.Application.Models;
using WalletAPI.Infrastructure.External;
using WalletAPI.Infrastructure.Repositories;

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

    public async Task<WalletSummaryDto?> GetWalletAsync(int userId, CancellationToken ct = default)
    {
        if (!await _users.ExistsAsync(userId, ct)) return null;

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
        if (!await _users.ExistsAsync(userId, ct))
            throw new KeyNotFoundException($"Usuário {userId} não encontrado.");

        if (string.IsNullOrWhiteSpace(upsert.Symbol)) throw new ArgumentException("Símbolo é obrigatório.");
        if (upsert.Amount < 0) throw new ArgumentException("Quantidade deve ser >= 0.");

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
        if (!await _users.ExistsAsync(userId, ct)) return false;
        return await _repo.RemoveItemAsync(userId, symbol, ct);
    }

    public async Task<TransferResultDto> TransferAsync(TransferRequestDto request, CancellationToken ct = default)
    {
        if (request is null) throw new ArgumentException("Requisição inválida.");
        if (request.Amount <= 0) throw new ArgumentException("Quantidade deve ser maior que 0.");
        if (request.FromUserId == request.ToUserId) throw new ArgumentException("Não é permitido transferir para si mesmo.");
        if (string.IsNullOrWhiteSpace(request.Symbol)) throw new ArgumentException("Símbolo é obrigatório.");

        // valida usuários
        if (!await _users.ExistsAsync(request.FromUserId, ct))
            throw new KeyNotFoundException($"Usuário remetente {request.FromUserId} não encontrado.");
        if (!await _users.ExistsAsync(request.ToUserId, ct))
            throw new KeyNotFoundException($"Usuário destinatário {request.ToUserId} não encontrado.");

        var normSymbol = request.Symbol.Trim().ToUpperInvariant();
        var price = await _prices.GetLastPriceUsdAsync(normSymbol, ct);

        var (tx, senderAfter, receiverAfter) = await _repo.TransferAsync(
            request.FromUserId, request.ToUserId, normSymbol, request.Amount, price, ct);

        return new TransferResultDto(
            tx.Id, tx.FromUserId, tx.ToUserId, tx.Symbol, tx.Amount,
            tx.PriceUsdAtTx, tx.TotalUsdAtTx, senderAfter, receiverAfter, tx.CreatedAt
        );
    }
}