namespace WalletAPI.Domain.Entities;

public class WalletTransaction
{
    public long Id { get; set; }
    public int FromUserId { get; set; }
    public int ToUserId { get; set; }
    public string Symbol { get; set; } = default!;
    public decimal Amount { get; set; }              // quantidade transferida
    public decimal? PriceUsdAtTx { get; set; }       // preço no momento da transferência
    public decimal? TotalUsdAtTx { get; set; }       // Amount * PriceUsdAtTx
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}