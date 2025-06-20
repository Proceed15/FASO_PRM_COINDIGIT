using currencyApiB.API.DTOs;
using currencyApiB.Application.Interfaces;

public class GetCurrencyDetailsUseCase
{
    private readonly ICurrencyService _currencyService;

    public GetCurrencyDetailsUseCase(ICurrencyService currencyService)
    {
        _currencyService = currencyService;
    }

    public CurrencyDTO? Execute(int id) => _currencyService.GetCurrencyDetails(id);
}
