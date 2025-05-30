using currencyApiB.API.DTOs;
using System.Collections.Generic;

// Exemplo de ICurrencyService
namespace currencyApiB.Application.Interfaces
{
    public interface ICurrencyService
    {
        CurrencyDTO RegisterCurrency(CurrencyDTO currencyDto);
        CurrencyDTO? GetCurrencyDetails(int id);
        List<CurrencyDTO> GetAllCurrencies();
        CurrencyDTO? UpdateCurrency(int id, CurrencyDTO currencyDto);
        bool DeleteCurrency(int id);
    }
}
