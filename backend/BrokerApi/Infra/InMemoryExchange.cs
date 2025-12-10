using System.Collections.Concurrent;
using Core;
using Core.IExchange;
using Core.IMessage;
using Core.IQueue;

namespace BrokerApi.API.Infra
{
    public class InMemoryExchange : IExchange
    {
        public string Name { get; }
        public ExchangeType Type { get; }

        private readonly ConcurrentDictionary<string, List<IQueue>> _bindings = new();

        public InMemoryExchange(string name, ExchangeType type)
        {
            Name = name;
            Type = type;
        }

        public void BindQueue(string routingKey, IQueue queue)
        {
            var bag = _bindings.GetOrAdd(routingKey ?? string.Empty, _ => new ConcurrentBag<IQueue>());
            bag.Add(queue);
        }

        public void UnbindQueue(string routingKey, IQueue queue)
        {

        }

        public async Task RouteAsync(IMessage message)
        {
            if (Type == ExchangeType.Fanout)
            {
                foreach (var kv in _bindings)
                {
                    foreach (var q in kv.Value)
                    {
                        await q.EnqueueAsync(message);
                    }
                    return;
                }
            }

            if (Type == ExchangeType.Direct)
            {
                if (_bindings.TryGetValue(message.RoutingKey, out var bag))
                {
                    foreach (var q in bag)
                    {
                        await q.EnqueueAsync(message);
                    }
                    return;
                }
            }

            if (Type == ExchangeType.Topic)
            {
                if (_bindings.TryGetValue(message.RoutingKey, out var bag2))
                {
                    foreach (var q in bag2)
                    {
                        await q.EnqueueAsync(message);
                    }
                }
                return;
            }
        }
    }
}