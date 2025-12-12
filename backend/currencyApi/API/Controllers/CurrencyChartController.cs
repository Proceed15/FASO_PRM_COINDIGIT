using Microsoft.AspNetCore.Mvc;
using CurrencyAPI.Application.Interfaces; // Seu namespace de interfaces (Service ou Repository)
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
//using CurrencyAPI.DTOs.CurrencyChartDto;
using System;
using CurrencyAPI.API.DTOs;
using CurrencyAPI.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using CurrencyAPI.Infrastructure.Data;
using CurrencyChartDto = CurrencyAPI.DTOs.CurrencyChartDto;

namespace CurrencyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CurrencyChartController : ControllerBase
    {
        // Injeção de Dependência do Serviço existente (que busca os dados brutos)
        private readonly ICurrencyService _currencyService;

        public CurrencyChartController(ICurrencyService currencyService)
        {
            _currencyService = currencyService;
        }

        // Endpoint: GET api/CurrencyChart/top-currencies
        [HttpGet("top-currencies")]
        public async Task<IActionResult> GetDataForGraph([FromQuery] int top = 10)
        {
            try
            {
                // 1. Busca os dados brutos (Raw Data)
                var allCurrencies = await _currencyService.GetAllAsync();

                if (allCurrencies == null || !allCurrencies.Any())
                {
                    return Ok(new List<CurrencyChartDto>()); // Retorna lista vazia, não erro 500
                }

                var chartData = new List<CurrencyChartDto>();

                // 2. Processamento Seguro (Try-Catch por item)
                foreach (var currency in allCurrencies)
                {
                    try
                    {
                        // Se a moeda for nula ou não tiver símbolo, pula
                        if (currency == null || string.IsNullOrWhiteSpace(currency.Symbol)) 
                            continue;

                        decimal currentPrice = 0.0m;

                        // Lógica para pegar o preço mais recente sem travar
                        if (currency.Histories != null && currency.Histories.Any())
                        {
                            // Ordena por data decrescente e pega o primeiro preço
                            var latestHistory = currency.Histories
                                .OrderByDescending(h => h.Date)
                                .FirstOrDefault();

                            if (latestHistory != null)
                            {
                                currentPrice = latestHistory.Price;
                            }
                        }

                        // Cria o objeto formatado
                        // Usa o Nome se tiver, senão usa o Símbolo
                        string displayName = string.IsNullOrWhiteSpace(currency.Name) 
                                             ? currency.Symbol 
                                             : currency.Name;

                        chartData.Add(new CurrencyChartDto
                        {
                            Symbol = currency.Symbol,
                            Label = $"{displayName} ({currency.Symbol})",
                            Value = currentPrice
                        });
                    }
                    catch (Exception)
                    {
                        // "Blindagem": Se der erro em UMA moeda específica, 
                        // apenas ignoramos ela e continuamos o loop para as outras.
                        continue;
                    }
                }

                // 3. Ordenação e Filtro Final
                // Retorna apenas as 'top' moedas mais valiosas (ex: Top 10) para o gráfico não poluir
                var finalResult = chartData
                    .Where(x => x.Value > 0) // Remove moedas com valor zero
                    .OrderByDescending(x => x.Value) // Do mais caro para o mais barato
                    .Take(top)
                    .ToList();

                return Ok(finalResult);
            }
            catch (Exception ex)
            {
                // Se der erro geral (banco fora do ar, etc), retorna erro tratado
                return StatusCode(500, new { message = "Erro ao gerar dados do gráfico", details = ex.Message });
            }
        }
    }
}
    // Um Objeto simples e leve, perfeito para o Frontend ler sem erros