namespace BrokerApi.Core
{
    public interface IExchange
    {
        Guid Id { get; }
        string RoutingKey { get; }
        byte[] body { get; }
        int DeliveryCount { get; }
        DateTime CreatedAt { get; }
    }
}