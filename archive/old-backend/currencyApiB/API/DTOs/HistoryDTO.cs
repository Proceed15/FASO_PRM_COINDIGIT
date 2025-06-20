namespace currencyApiB.API.DTOs
{
    public class HistoryDTO
    {
        public int Id { get; set; }
        public System.DateTime Date { get; set; }
        public decimal Price { get; set; }
        public int CurrencyId { get; set; }
    }
}
