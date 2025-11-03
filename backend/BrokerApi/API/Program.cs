

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

app.Run();