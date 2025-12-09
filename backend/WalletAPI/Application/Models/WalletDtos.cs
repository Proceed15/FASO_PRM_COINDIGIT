namespace WalletAPI.Application.Models
{
    public class WalletSummaryDto
    {
        public Guid WalletId { get; set; }
        public int UserId { get; set; }
        public List<WalletItemDto> Items { get; set; } = new();
        public decimal? TotalUsd { get; set; }
    }

    public class WalletItemDto
    {
        public string Symbol { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public decimal? LastPriceUsd { get; set; }
        public decimal? TotalUsd { get; set; }
    }

    public class WalletItemUpsertDto
    {
        public string Symbol { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }

    public class CreateWalletRequestDto
    {
        public int UserId { get; set; }
    }

    public class CreateWalletResponseDto
    {
        public Guid WalletId { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}