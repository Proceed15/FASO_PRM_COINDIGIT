using Microsoft.EntityFrameworkCore;
using currencyApiB.Infrastructure.Repositories;
using currencyApiB.Application.Interfaces;
using currencyApiB.Infrastructure.Data;
using currencyApiB.Application.Services;


public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<ICurrencyRepository, CurrencyRepository>();
        services.AddScoped<ICurrencyService, CurrencyService>();
        services.AddScoped<IHistoryRepository, HistoryRepository>();
        services.AddScoped<IHistoryService, HistoryService>();
        services.AddDbContext<CurrencyDbContext>(options =>
            options.UseSqlite("Data Source=currencydb.sqlite"));
        return services;
    }
}
