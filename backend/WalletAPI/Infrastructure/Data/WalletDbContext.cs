using Microsoft.EntityFrameworkCore;
using WalletAPI.Domain.Entities;

namespace WalletAPI.Infrastructure.Data
{
    public class WalletDbContext : DbContext
    {
        public WalletDbContext(DbContextOptions<WalletDbContext> options) : base(options) { }

        public DbSet<Wallet> Wallets => Set<Wallet>();
        public DbSet<WalletItem> WalletItems => Set<WalletItem>();
        public DbSet<WalletTransaction> Transactions => Set<WalletTransaction>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Wallet>(b =>
            {
                b.HasKey(x => x.Id);
                b.HasIndex(x => new { x.UserId });
            });

            modelBuilder.Entity<WalletItem>(b =>
            {
                b.HasKey(x => x.Id);
                b.HasIndex(x => new { x.WalletId, x.Symbol }).IsUnique();
                b.Property(x => x.Amount).HasColumnType("decimal(18,8)");
                b.Property(x => x.Symbol).HasMaxLength(20);
                b.HasOne(x => x.Wallet)
                     .WithMany(w => w.Items)
                     .HasForeignKey(x => x.WalletId)
                     .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<WalletTransaction>(b =>
            {
                b.HasKey(x => x.Id);
                b.HasIndex(x => new { x.WalletId, x.CreatedAt });
                b.HasIndex(x => x.TargetWalletId);
                b.Property(x => x.Symbol).HasMaxLength(20);
                b.Property(x => x.Amount).HasColumnType("decimal(18,8)");
                b.Property(x => x.PriceUsdAtTx).HasColumnType("decimal(18,8)");
                b.Property(x => x.TotalUsdAtTx).HasColumnType("decimal(18,8)");
            });
        }
    }
}