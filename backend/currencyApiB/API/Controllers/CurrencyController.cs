using Microsoft.AspNetCore.Mvc;
using currencyApiB.Application.Services;
using currencyApiB.Application.Interfaces;
using currencyApiB.API.DTOs;

namespace currencyApiB.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class CurrencyController : ControllerBase
    {
        private readonly ICurrencyService _currencyService;

        public CurrencyController(ICurrencyService currencyService)
        {
            _currencyService = currencyService;
        }

        [HttpPost]
        public IActionResult RegisterCurrency(CurrencyDTO currencyDto)
        {
            var result = _currencyService.RegisterCurrency(currencyDto);
            return Ok(result);
        }

        [HttpGet]
        public IActionResult GetAllCurrencies()
        {
            var currencies = _currencyService.GetAllCurrencies();
            return Ok(currencies);
        }

        [HttpGet("{id}")]
        public IActionResult GetCurrencyDetails(int id)
        {
            var currency = _currencyService.GetCurrencyDetails(id);
            return currency != null ? Ok(currency) : NotFound();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCurrency(int id)
        {
            var result = _currencyService.DeleteCurrency(id);
            return result ? NoContent() : NotFound();
        }

        [HttpPut("{id}")]
        public IActionResult UpdateCurrency(int id, CurrencyDTO currencyDto)
        {
            var updatedCurrency = _currencyService.UpdateCurrency(id, currencyDto);
            return updatedCurrency != null ? Ok(updatedCurrency) : NotFound();
        }
    }
}