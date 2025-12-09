using Microsoft.EntityFrameworkCore;
using WalletAPI.Domain.Entities;

namespace WalletAPI.Infrastructure.Data;

public class WalletDbContext : DbContext
{
    public WalletDbContext(DbContextOptions<WalletDbContext> options) : base(options) { }

    public DbSet<UserWallet> Wallets => Set<UserWallet>();
    public DbSet<WalletItem> WalletItems => Set<WalletItem>();
    public DbSet<WalletTransaction> Transactions => Set<WalletTransaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserWallet>(b =>
        {
            b.HasKey(w => w.Id);
            b.HasIndex(w => w.UserId).IsUnique();
            b.HasMany(w => w.Items)
             .WithOne()
             .HasForeignKey(i => i.UserWalletId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<WalletItem>(walletItem =>
        {
            walletItem.HasKey(i => i.Id);
            walletItem.Property(i => i.Symbol).IsRequired().HasMaxLength(20);
            walletItem.HasIndex(i => new { i.UserWalletId, i.Symbol }).IsUnique();
            walletItem.Property(i => i.Amount).HasColumnType("decimal(18,8)");
        });

        modelBuilder.Entity<WalletTransaction>(b =>
        {
            b.HasKey(t => t.Id);
            b.Property(t => t.Symbol).IsRequired().HasMaxLength(20);
            b.Property(t => t.Amount).HasColumnType("decimal(18,8)");
            b.Property(t => t.PriceUsdAtTx).HasColumnType("decimal(18,8)");
            b.Property(t => t.TotalUsdAtTx).HasColumnType("decimal(18,8)");
            b.HasIndex(t => t.CreatedAt);
            b.HasIndex(t => new { t.FromUserId, t.ToUserId, t.Symbol });
        });
    }
}