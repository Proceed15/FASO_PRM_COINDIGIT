    ﻿using BrokerApi.API;
using BrokerApi.Services;
using BrokerApi.Services.Interfaces; // se existir IBroker aqui
using BrokerApi.Core;

var builder = WebApplication.CreateBuilder(args);

// opcional: ajustar porta/local
builder.WebHost.UseUrls("http://localhost:5100");

// registra o Broker no DI (uma única instância compartilhada)
builder.Services.AddSingleton<Broker>();
builder.Services.AddSingleton<IBroker>(sp => sp.GetRequiredService<Broker>());

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();