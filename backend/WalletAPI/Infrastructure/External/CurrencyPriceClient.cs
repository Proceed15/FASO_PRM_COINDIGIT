using System.Net.Http.Json;

namespace WalletAPI.Infrastructure.External;

public class CurrencyPriceClient : ICurrencyPriceClient
{
    private readonly HttpClient _http;
    public CurrencyPriceClient(HttpClient http) => _http = http;

    private record SummaryItem(string? id, string? symbol, string? name, decimal? price, decimal? change);
    private record DetailItem(string? id, string? symbol, string? name, decimal? price, decimal? change);

    public async Task<decimal?> GetLastPriceUsdAsync(string symbol, CancellationToken ct = default)
    {
        var sym = symbol.Trim().ToUpperInvariant();

        try
        {
            var detailResp = await _http.GetAsync($"/api/Currency/{Uri.EscapeDataString(sym)}", ct);
            if (detailResp.IsSuccessStatusCode)
            {
                var dto = await detailResp.Content.ReadFromJsonAsync<DetailItem>(cancellationToken: ct);
                if (dto?.price is not null) return dto.price;
            }


            var summaryResp = await _http.GetAsync("/api/Currency/summary", ct);
            if (summaryResp.IsSuccessStatusCode)
            {
                var list = await summaryResp.Content.ReadFromJsonAsync<List<SummaryItem>>(cancellationToken: ct);
                var hit = list?.FirstOrDefault(x => string.Equals(x?.symbol, sym, StringComparison.OrdinalIgnoreCase));
                if (hit?.price is not null) return hit.price;
            }

            // Se nada retornar preço, devolve null
            return null;
        }
        catch
        {
            // Em qualquer erro de rede/formato, não derruba a solicitação da carteira
            return null;
        }
    }
}