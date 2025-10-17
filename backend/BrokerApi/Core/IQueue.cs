namespace BrokerApi.API.Core
{
    public interface IQueue
    {
        string Name { get; }
        Task EnqueueAsync(IMessage message);
        Task<Message?> DequeueAsync(CancellationToken ct);
        int Count { get; }
    }
}