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

    // Lista todas as carteiras do usuário
    [HttpGet("{userId:int}")]
    public async Task<ActionResult<List<WalletSummaryDto>>> List(int userId, CancellationToken ct)
    {
        try
        {
            var res = await _service.ListWalletsAsync(userId, ct);
            return Ok(res);
        }
        catch (InvalidOperationException ex)
        {
            // Usuário não existe
            return BadRequest(ex.Message);
        }
    }

    // POST /api/wallet/{userId} → cria uma nova carteira para o usuário
    [HttpPost("{userId:int}")]
    public async Task<ActionResult<CreateWalletResponseDto>> Create(int userId, CancellationToken ct)
    {
        try
        {
            var res = await _service.CreateWalletAsync(userId, ct);
            return CreatedAtAction(nameof(Get), new { userId, walletId = res.WalletId }, res);
        }
        catch (InvalidOperationException ex)
        {
            // Usuário não existe
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("{userId:int}/{walletId:guid}")]
    public async Task<ActionResult<WalletSummaryDto>> Get(int userId, Guid walletId, CancellationToken ct)
    {
        var res = await _service.GetWalletAsync(userId, walletId, ct);
        if (res is null) return NotFound();
        return Ok(res);
    }

    [HttpPost("{userId:int}/{walletId:guid}/items")]
    public async Task<ActionResult<WalletSummaryDto>> UpsertItem(int userId, Guid walletId, [FromBody] WalletItemUpsertDto dto, CancellationToken ct)
    {
        try
        {
            var res = await _service.UpsertWalletItemAsync(userId, walletId, dto, ct);
            if (res is null) return NotFound();
            return Ok(res);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{userId:int}/{walletId:guid}/items/{symbol}")]
    public async Task<ActionResult> RemoveItem(int userId, Guid walletId, string symbol, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(symbol)) return BadRequest("Símbolo é obrigatório.");
        var ok = await _service.RemoveWalletItemAsync(userId, walletId, symbol, ct);
        if (!ok) return NotFound();
        return NoContent();
    }

    [HttpPost("transfer")]
    public async Task<ActionResult<TransferResultDto>> Transfer([FromBody] TransferRequestDto dto, CancellationToken ct)
    {
        try
        {
            var res = await _service.TransferAsync(dto, ct);
            return Ok(res);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}