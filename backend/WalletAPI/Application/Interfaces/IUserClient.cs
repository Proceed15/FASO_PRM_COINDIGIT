namespace WalletAPI.Application.Interfaces;

public interface IUserClient
{
    Task<bool> ExistsAsync(int userId, CancellationToken ct = default);
}