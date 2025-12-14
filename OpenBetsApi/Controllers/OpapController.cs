using Microsoft.AspNetCore.Mvc;
using OpenBetsApi.Services;

namespace OpenBetsApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OpapController : ControllerBase
{
    private readonly OpapApiService _opapService;
    private readonly ILogger<OpapController> _logger;

    public OpapController(OpapApiService opapService, ILogger<OpapController> logger)
    {
        _opapService = opapService;
        _logger = logger;
    }

    // POST: api/Opap/import?gameId=5104&drawId=1234
    [HttpPost("import")]
    public async Task<IActionResult> ImportDraw([FromQuery] int gameId = 5104, [FromQuery] int drawId = 0)
    {
        if (drawId == 0)
        {
            return BadRequest(new { message = "DrawId is required" });
        }

        _logger.LogInformation("Importing draw {DrawId} for game {GameId}", drawId, gameId);
        
        var success = await _opapService.ImportDraw(gameId, drawId);

        if (success)
        {
            return Ok(new { 
                message = "Draw imported successfully", 
                gameId, 
                drawId 
            });
        }

        return BadRequest(new { 
            message = "Failed to import draw. It may already exist or the API request failed.",
            gameId,
            drawId
        });
    }

    // POST: api/Opap/import-range?gameId=5104&fromDrawId=1000&toDrawId=1010
    [HttpPost("import-range")]
    public async Task<IActionResult> ImportDrawRange(
        [FromQuery] int gameId = 5104, 
        [FromQuery] int fromDrawId = 0,
        [FromQuery] int toDrawId = 0)
    {
        if (fromDrawId == 0 || toDrawId == 0 || fromDrawId > toDrawId)
        {
            return BadRequest(new { message = "Valid fromDrawId and toDrawId are required" });
        }

        var imported = 0;
        var failed = 0;

        for (int drawId = fromDrawId; drawId <= toDrawId; drawId++)
        {
            var success = await _opapService.ImportDraw(gameId, drawId);
            if (success)
                imported++;
            else
                failed++;

            // Small delay to avoid hammering the API
            await Task.Delay(500);
        }

        return Ok(new { 
            message = $"Import completed",
            gameId,
            imported,
            failed,
            total = toDrawId - fromDrawId + 1
        });
    }
}
