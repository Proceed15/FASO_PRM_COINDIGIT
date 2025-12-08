using System.Net.Http.Json;

namespace WalletAPI.Infrastructure.External;

public class CurrencyPriceClient : ICurrencyPriceClient
{
    private readonly HttpClient _http;
    public CurrencyPriceClient(HttpClient http) => _http = http;

    private record CurrencyWithLastPriceDto(string? symbol, decimal? lastPriceUsd);
    private record CurrencySummaryItem(string? symbol, decimal? lastPriceUsd);

    public async Task<decimal?> GetLastPriceUsdAsync(string symbol, CancellationToken ct = default)
    {
        try
        {
            var detailResp = await _http.GetAsync($"/api/Currency/{Uri.EscapeDataString(symbol)}", ct);
            if (detailResp.IsSuccessStatusCode)
            {
                var dto = await detailResp.Content.ReadFromJsonAsync<CurrencyWithLastPriceDto>(cancellationToken: ct);
                if (dto?.lastPriceUsd is not null) return dto.lastPriceUsd;
            }

         
            var summaryResp = await _http.GetAsync("/api/Currency/summary", ct);
            if (summaryResp.IsSuccessStatusCode)
            {
                var list = await summaryResp.Content.ReadFromJsonAsync<List<CurrencySummaryItem>>(cancellationToken: ct);
                var hit = list?.FirstOrDefault(x => string.Equals(x?.symbol, symbol, StringComparison.OrdinalIgnoreCase));
                if (hit?.lastPriceUsd is not null) return hit.lastPriceUsd;
            }

            // Se nada retornar preço, devolve null (sem quebrar a API)
            return null;
        }
        catch
        {
            // Em qualquer erro de rede/formato, não derruba a solicitação da carteira
            return null;
        }
    }
}