namespace WalletAPI.Domain.Entities
{
    public class WalletItem
    {
        public int Id { get; set; }
        public Guid WalletId { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public Wallet? Wallet { get; set; }
    }
}