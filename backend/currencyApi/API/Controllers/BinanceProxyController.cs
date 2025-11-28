using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;

namespace CurrencyAPI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BinanceProxyController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public BinanceProxyController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpGet("ticker/price")]
        public async Task<IActionResult> GetTickerPrice([FromQuery]string symbol)
        {
            if (string.IsNullOrWhiteSpace(symbol))
            {
                return BadRequest("Symbol parameter is required.");
            }

            var client = _httpClientFactory.CreateClient();

            // Compose the corrected lower case path URL for Binance API
            var url = $"https://api.binance.com/api/v3/ticker/price?symbol={symbol.ToUpper()}";

            var response = await client.GetAsync(url);
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Error querying Binance API.");
            }

            var content = await response.Content.ReadAsStringAsync();
            return Content(content, "application/json");
        }
    }
}
