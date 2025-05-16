using currencyAPI.API.DTOs;

public interface ICurrencyService
{
    CurrencyDTO RegisterCurrency(CurrencyDTO currencyDto);
    CurrencyDTO? GetCurrencyDetails(int Id);
    List<CurrencyDTO> GetAllCurrency();
    // UserDTO? GetUserByEmail(string email);
    CurrencyDTO? UpdateCurrency(int Id, CurrencyDTO currencyDto);
    // CurrencyDTO? ValidateUser(string email, string password);
    bool DeleteCurrency(int Id);
}
