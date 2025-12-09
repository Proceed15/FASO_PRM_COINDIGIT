using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WalletAPI.Application.Interfaces;
using WalletAPI.Application.Services;
using WalletAPI.Infrastructure.Data;
using WalletAPI.Infrastructure.External;
using WalletAPI.Infrastructure.Repositories;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Fixar URL/porta da API (ajuste se necessário)
builder.WebHost.UseUrls("http://localhost:5004");

// Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbContext (Sqlite)
var cs = builder.Configuration.GetConnectionString("WalletDb") ?? "Data Source=walletdb.sqlite";
builder.Services.AddDbContext<WalletDbContext>(opts => opts.UseSqlite(cs));

// Repositório + Serviço
builder.Services.AddScoped<IWalletRepository, WalletRepository>();
builder.Services.AddScoped<IWalletService, WalletService>();

// HttpClient para currencyApi
var currencyBase = builder.Configuration["ExternalServices:CurrencyApiBaseUrl"] ?? "http://localhost:5002";
builder.Services.AddHttpClient<ICurrencyPriceClient, CurrencyPriceClient>(client =>
{
    client.BaseAddress = new Uri(currencyBase);
});

// HttpClient para userAPI via gateway (http://localhost:5000)
var gatewayBase = builder.Configuration["ExternalServices:GatewayBaseUrl"] ?? "http://localhost:5000";
builder.Services.AddHttpClient<IUserClient, UserClient>(client =>
{
    client.BaseAddress = new Uri(gatewayBase);
});

// Autenticação JWT (opcional, habilitado)
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

if (!string.IsNullOrWhiteSpace(jwtKey))
{
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            var keyBytes = Encoding.UTF8.GetBytes(jwtKey);
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = !string.IsNullOrWhiteSpace(jwtIssuer),
                ValidateAudience = !string.IsNullOrWhiteSpace(jwtAudience),
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtIssuer,
                ValidAudience = jwtAudience,
                IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
            };
        });
}

var app = builderBuild(builder);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

if (!string.IsNullOrWhiteSpace(jwtKey))
{
    app.UseAuthentication();
    app.UseAuthorization();
}

app.MapControllers();

// Migrar/criar banco
await EnsureDatabaseAsync(app);

await app.RunAsync();

static WebApplication builderBuild(WebApplicationBuilder builder) => builder.Build();

static async Task EnsureDatabaseAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<WalletDbContext>();
    try
    {
        await db.Database.MigrateAsync();
    }
    catch
    {
        await db.Database.EnsureCreatedAsync();
    }
}
