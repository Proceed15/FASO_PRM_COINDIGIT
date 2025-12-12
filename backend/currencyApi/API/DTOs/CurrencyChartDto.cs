namespace CurrencyAPI.DTOs
{
    public class CurrencyChartDto
    {
        public string Symbol { get; set; } = string.Empty; // Ex: "BTC"
        public string Label { get; set; } = string.Empty;  // Ex: "Bitcoin (BTC)"
        public decimal Value { get; set; } = 0.0m;         // Ex: 92000.50
    }
}