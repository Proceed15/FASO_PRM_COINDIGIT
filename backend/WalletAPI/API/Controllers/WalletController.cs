using Microsoft.AspNetCore.Mvc;
using WalletAPI.Application.Interfaces;
using WalletAPI.Application.Models;

namespace WalletAPI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WalletController : ControllerBase
{
    private readonly IWalletService _service;
    public WalletController(IWalletService service) => _service = service;

    [HttpGet("{userId:int}")]
    public async Task<ActionResult<WalletSummaryDto>> Get(int userId, CancellationToken ct)
    {
        var summary = await _service.GetWalletAsync(userId, ct);
        if (summary is null) return NotFound();
        return Ok(summary);
    }

    [HttpPost("{userId:int}/items")]
    public async Task<ActionResult<WalletSummaryDto>> UpsertItem(int userId, [FromBody] WalletItemUpsertDto upsert, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(upsert.Symbol) || upsert.Amount < 0)
            return BadRequest("Símbolo é obrigatório e quantidade deve ser >= 0.");

        var summary = await _service.UpsertWalletItemAsync(userId, upsert, ct);
        return Ok(summary);
    }

    [HttpDelete("{userId:int}/items/{symbol}")]
    public async Task<ActionResult> RemoveItem(int userId, string symbol, CancellationToken ct)
    {
        var ok = await _service.RemoveWalletItemAsync(userId, symbol, ct);
        return ok ? NoContent() : NotFound();
    }
}