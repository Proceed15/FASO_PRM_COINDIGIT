namespace WalletAPI.Application.Models
{
    public class TransferRequestDto
    {
        public int FromUserId { get; set; }
        public int ToUserId { get; set; }
        public Guid? FromWalletId { get; set; }
        public Guid? ToWalletId { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }

    public class TransferResultDto
    {
        public string Symbol { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public decimal SenderBalanceAfter { get; set; }
        public decimal ReceiverBalanceAfter { get; set; }
        public decimal? PriceUsdAtTx { get; set; }
        public decimal? TotalUsdAtTx { get; set; }
    }
}