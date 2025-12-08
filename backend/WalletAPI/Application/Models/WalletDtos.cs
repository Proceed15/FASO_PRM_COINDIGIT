namespace WalletAPI.Application.Models;

public record WalletItemDto(string Symbol, decimal Amount, decimal? LastPriceUsd, decimal? TotalUsd);

public record WalletSummaryDto(int UserId, IReadOnlyList<WalletItemDto> Items, decimal TotalUsd);

public record WalletItemUpsertDto(string Symbol, decimal Amount);