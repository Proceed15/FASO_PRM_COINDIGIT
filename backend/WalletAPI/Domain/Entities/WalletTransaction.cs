namespace WalletAPI.Domain.Entities
{
    public class WalletTransaction
    {
        public long Id { get; set; }

        public Guid WalletId { get; set; }
        public Guid? TargetWalletId { get; set; }

        public int FromUserId { get; set; }
        public int ToUserId { get; set; }

        public string Symbol { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public decimal? PriceUsdAtTx { get; set; }
        public decimal? TotalUsdAtTx { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}