namespace WalletAPI.Domain.Entities;

public class UserWallet
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public List<WalletItem> Items { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}

public class WalletItem
{
    public int Id { get; set; }
    public int UserWalletId { get; set; }
    public string Symbol { get; set; } = default!; // ex.: "BTC", "ETH", "USDT"
    public decimal Amount { get; set; }            // quantidade que usuário possui
}