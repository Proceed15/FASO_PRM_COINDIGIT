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

    // GET /api/wallet/{userId}
    [HttpGet("{userId:int}")]
    public async Task<ActionResult<WalletSummaryDto>> Get(int userId, CancellationToken ct)
    {
        var summary = await _service.GetWalletAsync(userId, ct);
        if (summary is null) return NotFound();
        return Ok(summary);
    }

    // POST /api/wallet/{userId}/items
    [HttpPost("{userId:int}/items")]
    public async Task<ActionResult<WalletSummaryDto>> UpsertItem(int userId, [FromBody] WalletItemUpsertDto upsert, CancellationToken ct)
    {
        try
        {
            var summary = await _service.UpsertWalletItemAsync(userId, upsert, ct);
            return Ok(summary);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Usuário {userId} não encontrado.");
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // DELETE /api/wallet/{userId}/items/{symbol}
    [HttpDelete("{userId:int}/items/{symbol}")]
    public async Task<ActionResult> RemoveItem(int userId, string symbol, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(symbol)) return BadRequest("Símbolo é obrigatório.");

        var ok = await _service.RemoveWalletItemAsync(userId, symbol, ct);
        return ok ? NoContent() : NotFound();
    }

    // POST /api/wallet/transfer
    [HttpPost("transfer")]
    public async Task<ActionResult<TransferResultDto>> Transfer([FromBody] TransferRequestDto request, CancellationToken ct)
    {
        try
        {
            var result = await _service.TransferAsync(request, ct);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message); // saldo insuficiente ou remetente sem saldo
        }
    }
}