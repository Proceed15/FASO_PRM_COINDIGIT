using currencyApiB.API.DTOs;
using currencyApiB.Application.Interfaces;
public class RegisterCurrencyUseCase
{
    private readonly ICurrencyService _currencyService;

    public RegisterCurrencyUseCase(ICurrencyService currencyService)
    {
        _currencyService = currencyService;
    }

    public CurrencyDTO Execute(CurrencyDTO currencyDto) => _currencyService.RegisterCurrency(currencyDto);
}