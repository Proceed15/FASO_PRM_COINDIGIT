namespace BrokerApi.Core
{
    public interface IMessage
    {
        Guid Id { get; }
        string? RoutingKey { get; }
        byte[] Body { get; }
        int DeliveryCount { get; set; }
        DateTime CreatedAt { get; }
    }
}