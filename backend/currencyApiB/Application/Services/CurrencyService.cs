using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

public class CurrencyService : ICurrencyService
{
    //Services for Users
    private readonly ICurrencyRepository _currencyRepository;

    public CurrencyService(ICurrencyRepository currencyRepository)
    {
        _currencyRepository = currencyRepository;
    }

    public CurrencyDTO RegisterCurrency(CurrencyDTO CurrencyDto)
    {
        // var hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

        var currency = new Currency
        {
            Name = currencyDto.Name,
            Description = currencyDto.Description,
            Backing = currencyDto.Backing,
            Status = currencyDto.Status
        };
        _currencyRepository.Add(currency);

        return new CurrencyDTO
        {
            Id = currency.Id,
            Name = currency.Name,
            Description = currency.Description,
            Backing = currency.Backing,
            Status = currency.Status
        };
    }

    public CurrencyDTO? GetCurrencyDetails(int id)
    {
        var currency = _currencyRepository.GetById(id);
        return currency != null ? new CurrencyDTO
        {
            Id = currency.Id,
            Name = currency.Name,
            Description = currency.Description,
            Backing = currency.Backing,
            Status = currency.Status
        } : null;
    }

    public List<CurrencyDTO> GetAllCurrency()
    {
        return _CurrencyRepository.GetAll().Select(Currency => new CurrencyDTO
        {
            Id = currency.Id,
            Name = currency.Name,
            Description = currency.Description,
            Backing = currency.Backing,
            Status = currency.Status
        }).ToList();
    }

    /*
    public UserDTO? GetUserByEmail(string email)
    {
        var user = _userRepository.GetByEmail(email);
        return user != null ? new UserDTO
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            Password = user.Password,
            Photo = user.Photo
        } : null;
    }
    */

    public CurrencyDTO? UpdateCurrency(int id, CurrencyDTO currencyDto)
    {
        // var hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
        var currency = _currencyRepository.GetById(id);
        if (currency == null) return null;

        currency.Name = currencyDto.Name;
        currency.Description = currencyDto.Description;
        currency.Backing = currencyDto.Backing;
        currency.Status = currencyDto.Status;

        _currencyRepository.Update(currency);

        return new currencyDTO
        {
            Id = currency.Id,
            Name = currency.Name,
            Description = currency.Description,
            Backing = currency.Backing,
            Status = currency.Status
        };
    }
    /*
    public async Task EditUserAsync( User user)
    {
        await _userRepository.EditUserAsync(user);
    }
    */
    public bool DeleteCurrency(int id)
    {
        var currency = _currencyRepository.GetById(id);
        if (currency == null) return false;
        _currencyRepository.Delete(id);
        return true;
    }

    public CurrencyDTO? ReturnCurrencyValidate()
    {
        // var currency = _currencyRepository.GetByEmail(email);
        // if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
        // { return null; }

        return new CurrencyDTO
        {
            Id = currency.Id,
            Name = currency.Name,
            Description = currency.Description,
            Backing = currency.Backing,
            Status = currency.Status
        };
    }

}
