using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls("http://localhost:5000");

// garantir que ocelot.json seja carregado antes de AddOcelot
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// autenticação JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"] ?? "sua-chave-jwt-aqui")
            )
        };
    });

// autorização (necessário quando usar AuthenticationOptions no ocelot.json)
builder.Services.AddAuthorization();

// registra ocelot com a configuração carregada
builder.Services.AddOcelot(builder.Configuration);

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

// inicializa o Ocelot
await app.UseOcelot();

app.Run();