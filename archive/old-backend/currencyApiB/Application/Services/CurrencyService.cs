using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using currencyApiB.Domain.Entities;
using currencyApiB.Application.Interfaces;
using currencyApiB.API.DTOs;


namespace currencyApiB.Application.Services
{
    public class CurrencyService : ICurrencyService
    {
        private readonly ICurrencyRepository _currencyRepository;

        public CurrencyService(ICurrencyRepository currencyRepository)
        {
            _currencyRepository = currencyRepository;
        }

        public CurrencyDTO RegisterCurrency(CurrencyDTO currencyDto)
        {
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

        public List<CurrencyDTO> GetAllCurrencies()
        {
            return _currencyRepository.GetAll().Select(currency => new CurrencyDTO
            {
                Id = currency.Id,
                Name = currency.Name,
                Description = currency.Description,
                Backing = currency.Backing,
                Status = currency.Status
            }).ToList();
        }

        public CurrencyDTO? UpdateCurrency(int id, CurrencyDTO currencyDto)
        {
            var currency = _currencyRepository.GetById(id);
            if (currency == null) return null;

            currency.Name = currencyDto.Name;
            currency.Description = currencyDto.Description;
            currency.Backing = currencyDto.Backing;
            currency.Status = currencyDto.Status;

            _currencyRepository.Update(currency);

            return new CurrencyDTO
            {
                Id = currency.Id,
                Name = currency.Name,
                Description = currency.Description,
                Backing = currency.Backing,
                Status = currency.Status
            };
        }

        public bool DeleteCurrency(int id)
        {
            var currency = _currencyRepository.GetById(id);
            if (currency == null) return false;
            _currencyRepository.Delete(id);
            return true;
        }
    }
} 