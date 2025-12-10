using System.Net;

namespace WalletAPI.Infrastructure.External;

public class UserClient : WalletAPI.Application.Interfaces.IUserClient
{
    private readonly HttpClient _http;
    public UserClient(HttpClient http) => _http = http;

    public async Task<bool> ExistsAsync(int userId, CancellationToken ct = default)
    {
        // Gateway mapeia /api/User/{id} para a userAPI (porta 5120)
        var resp = await _http.GetAsync($"/api/User/{userId}", ct);
        if (resp.StatusCode == HttpStatusCode.NotFound) return false;
        return resp.IsSuccessStatusCode;
    }
}