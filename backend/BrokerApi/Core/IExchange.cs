namespace BrokerApi.Core
{
    public interface IExchange
    {
        string Name { get; }
        ExchangeType Type { get; }

        void BindQueue(string routingKey, IQueue queue);
        void UnbindQueue(string routingKey, IQueue queue);
        Task PublishAsync(Message message);
    }
}