
using System.Text;
using BrokerApi.Services;
using BrokerApi.Core;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls("http://localhost:5100");

builder.Services.AddSingleton<IBroker, Broker>();
builder.Services.AddControllers();

//suporte para Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

//pipeline http
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
app.UseAuthorization();
app.MapControllers();

{
    var broker = app.Services.GetRequiredService<IBroker>();

    broker.DeclareExchange("amq.direct", ExchangeType.Direct);
    var qName = "task_queue";
    broker.DeclareQueue(qName);
    broker.Bind("amq.direct", "task", qName);

    var consumer = new Consumer(broker, qName, async (msg) =>
    {
        var body = Encoding.UTF8.GetString(msg.Body);
        Console.WriteLine($"Consumer got: {body}");

        if (body.Contains("fail") && msg.DeliveryCount < 1)
        {
            Console.WriteLine("Simulating failure");
            return false;
        }

        await Task.Delay(200);
        return true;
    }, maxRetries: 2);

    _ = Task.Run(() => consumer.StartAsync(app.Lifetime.ApplicationStopping));

    var producer = new Producer(broker);
    _ = Task.Run(async () =>
    {
        await Task.Delay(500);
        await producer.SendAsync("amq.direct", "task", "hello 1");
        await producer.SendAsync("amq.direct", "task", "hello fail");
        await producer.SendAsync("amq.direct", "task", "hello 3");
        Console.WriteLine("Messages published at startup.");
    });
}

app.Run();