namespace WalletAPI.Infrastructure.External;

public interface ICurrencyPriceClient
{
    Task<decimal?> GetLastPriceUsdAsync(string symbol, CancellationToken ct = default);
}