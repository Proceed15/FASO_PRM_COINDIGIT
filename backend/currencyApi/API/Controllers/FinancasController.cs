/*using CurrencyAPI.API.DTOs; // Importe seus DTOs
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
namespace CurrencyAPI.API.Controllers
{
    public class FinancasController : ControllerBase
    {
        // Simulação de um Service/Repository
        [HttpGet("cotacao/{moeda}")]
        public ActionResult<CurrencySummaryDto> GetCotacao(string moeda)
        {
            // Aqui você buscaria no banco e mapearia para o DTO
            // Estou "mockando" (simulando) um retorno para o exemplo
            var summary = new CurrencySummaryDto
            {
                Id = Guid.NewGuid(),
                Symbol = moeda.ToUpper(), // Ex: "BTC"
                Name = "Bitcoin",         // Ex: "Bitcoin"
                Price = 350000.50m,       // Ex: Valor Decimal
                Change = 1.2m             // Variação
            };

            // Por padrão, o ASP.NET Core serializa em camelCase (symbol, price, name)
            return Ok(summary);
        }
    }
}
*/