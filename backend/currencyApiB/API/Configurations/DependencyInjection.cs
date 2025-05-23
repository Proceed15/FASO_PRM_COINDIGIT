using Microsoft.EntityFrameworkCore;
using currencyAPI.Infrastructure.Repositories;
using currencyAPI.Domain.Interfaces;
using currencyAPI.Infrastructure.Data;
using currencyAPI.Application.Services;


public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<ICurrencyRepository, CurrencyRepository>();
        services.AddScoped<ICurrencyService, CurrencyService>();
        services.AddDbContext<CurrencyDbContext>(options =>
            options.UseSqlite("Data Source=currencydb.sqlite"));
        return services;
    }
}