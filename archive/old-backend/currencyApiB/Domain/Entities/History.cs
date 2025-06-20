using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace currencyApiB.Domain.Entities
{
    public class History
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public decimal Price { get; set; }

        [ForeignKey("Currency")]
        public int CurrencyId { get; set; }

        [JsonIgnore]
        public Currency? Currency { get; set; }
    }
}
