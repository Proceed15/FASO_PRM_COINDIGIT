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
                Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"] ?? "Apollo_ Key_Athena_Key_SSH256bits_Key")
            )
        };
    });

// autorização (necessário quando usar AuthenticationOptions no ocelot.json)
builder.Services.AddAuthorization();

// registra ocelot com a configuração carregada
builder.Services.AddOcelot(builder.Configuration);

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// CORS
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

// inicializa o Ocelot
await app.UseOcelot();

app.Run();