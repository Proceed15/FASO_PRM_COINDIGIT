namespace WalletAPI.Application.Models;

public record TransferRequestDto(int FromUserId, int ToUserId, string Symbol, decimal Amount);

public record TransferResultDto(
    long TransactionId,
    int FromUserId,
    int ToUserId,
    string Symbol,
    decimal Amount,
    decimal? PriceUsdAtTx,
    decimal? TotalUsdAtTx,
    decimal SenderBalanceAfter,
    decimal ReceiverBalanceAfter,
    DateTime CreatedAt
);