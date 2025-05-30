using Microsoft.EntityFrameworkCore;
using currencyApiB.Domain.Entities;

namespace currencyApiB.Infrastructure.Data
{
    public class CurrencyDbContext : DbContext
    {
        public CurrencyDbContext(DbContextOptions<CurrencyDbContext> options) : base(options)
        {
        }

        public DbSet<Currency> Currencies { get; set; }
        public DbSet<History> Histories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<History>()
                .HasKey(h => new { h.Id, h.Date, h.Price });

            modelBuilder.Entity<History>()
                .HasOne(h => h.Currency)
                .WithMany()
                .HasForeignKey(h => h.CurrencyId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
