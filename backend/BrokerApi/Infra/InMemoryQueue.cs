using System.Collections.Concurrent;
using BrokerApi.Core;

namespace BrokerApi.Infra
{

    public class InMemoryQueue : IQueue
    {
        private readonly ConcurrentQueue<IMessage> _queue = new();
        private readonly SemaphoreSlim _sem = new(0);

        public string Name { get; }

        public InMemoryQueue(string name)
        {
            Name = name;
        }

        public Task EnqueueAsync(IMessage message)
        {
            _queue.Enqueue(message);
            _sem.Release();
            return Task.CompletedTask;
        }

        public async Task<IMessage?> DequeueAsync(CancellationToken ct)
        {
            try
            {
                await _sem.WaitAsync(ct);
            }
            catch (OperationCanceledException)
            {
                return null;
            }

            if (_queue.TryDequeue(out var msg))
                return msg;

            return null;
        }

        public int Count => _queue.Count;
    }
}