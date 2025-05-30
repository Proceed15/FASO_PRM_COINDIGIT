using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace currencyApiB.Domain.Entities
{
    public class History
    {
        [Key, Column(Order = 0)]
        public int Id { get; set; }

        [Key, Column(Order = 1)]
        public DateTime Date { get; set; }

        [Key, Column(Order = 2)]
        public decimal Price { get; set; }

        [ForeignKey("Currency")]
        public int CurrencyId { get; set; }

        public Currency Currency { get; set; }
    }
}
