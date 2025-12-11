using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WalletAPI.Application.Interfaces;
using WalletAPI.Application.Services;
using WalletAPI.Infrastructure.Data;
using WalletAPI.Infrastructure.External;
using WalletAPI.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Definir porta fixa
builder.WebHost.UseUrls("http://localhost:5004");

// Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbContext
var cs = builder.Configuration.GetConnectionString("WalletDb") ?? "Data Source=walletdb.sqlite";
builder.Services.AddDbContext<WalletDbContext>(opts => opts.UseSqlite(cs));

// Repositório + Serviço
builder.Services.AddScoped<IWalletRepository, WalletRepository>();
builder.Services.AddScoped<IWalletService, WalletService>();

// HttpClient Currency
var currencyBase = builder.Configuration["ExternalServices:CurrencyApiBaseUrl"] ?? "http://localhost:5002";
builder.Services.AddHttpClient<ICurrencyPriceClient, CurrencyPriceClient>(client =>
{
    client.BaseAddress = new Uri(currencyBase);
});

// HttpClient User
var gatewayBase = builder.Configuration["ExternalServices:GatewayBaseUrl"] ?? "http://localhost:5000";
builder.Services.AddHttpClient<IUserClient, UserClient>(client =>
{
    client.BaseAddress = new Uri(gatewayBase);
});

// JWT
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

var app = builder.Build();

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware
if (!string.IsNullOrWhiteSpace(jwtKey))
{
    app.UseAuthentication();
    app.UseAuthorization();
}

app.MapControllers();

// Aplicar migrations ao iniciar
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<WalletDbContext>();
    db.Database.Migrate();
}

app.Run();
