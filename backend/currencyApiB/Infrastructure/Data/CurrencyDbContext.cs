using Microsoft.EntityFrameworkCore;
using currencyAPI.Domain.Models;

namespace currencyAPI.Infrastructure.Data
{
    // DbContext for the Currency API
    // This class is responsible for interacting with the database
    // and managing the Currency entities.
    // It inherits from DbContext, which is part of Entity Framework Core.

    public class CurrencyDbContext : DbContext
    {
        public CurrencyDbContext(DbContextOptions<CurrencyDbContext> options) : base(options) { }
        public DbSet<Currency> Currencies { get; set; }
    }
}