namespace currencyAPI.Domain.Models
{
    public class Currency
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Backing { get; set; }
        public string Status { get; set; }
    }

}