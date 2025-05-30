namespace currencyApiB.API.DTOs
{
    public class CurrencyDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Backing { get; set; }
        public string Status { get; set; }
    }
}