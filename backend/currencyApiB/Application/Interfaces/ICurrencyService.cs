using currencyAPI.API.DTOs;

// Exemplo de ICurrencyService
public interface ICurrencyService
{
    CurrencyDTO RegisterCurrency(CurrencyDTO currencyDto);
    CurrencyDTO? GetCurrencyDetails(int id);
    List<CurrencyDTO> GetAllCurrencies();
    CurrencyDTO? UpdateCurrency(int id, CurrencyDTO currencyDto);
    bool DeleteCurrency(int id);
}
