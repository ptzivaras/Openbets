using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpenBetsApi.Data;
using OpenBetsApi.DTOs;

namespace OpenBetsApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GameDrawResultsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public GameDrawResultsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/GameDrawResults?drawId=1234&gameId=5104
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GameDrawResultDto>>> GetDrawResults(
        [FromQuery] int? drawId = null,
        [FromQuery] int? gameId = null)
    {
        var query = _context.GameDrawResults.AsQueryable();

        if (drawId.HasValue)
        {
            query = query.Where(r => r.DrawId == drawId.Value);
        }

        if (gameId.HasValue)
        {
            query = query.Where(r => r.GameId == gameId.Value);
        }

        var results = await query
            .OrderByDescending(r => r.DrawId)
            .ThenBy(r => r.WinningCategoryDescr)
            .Select(r => new GameDrawResultDto
            {
                Id = r.Id,
                GameId = r.GameId,
                DrawId = r.DrawId,
                WinningCategoryDescr = r.WinningCategoryDescr,
                SuccessesCount = r.SuccessesCount,
                DividentAmount = r.DividentAmount,
                TotalPayout = r.TotalPayout
            })
            .ToListAsync();

        return Ok(results);
    }

    // GET: api/GameDrawResults/5
    [HttpGet("{id}")]
    public async Task<ActionResult<GameDrawResultDto>> GetGameDrawResult(int id)
    {
        var result = await _context.GameDrawResults
            .Where(r => r.Id == id)
            .Select(r => new GameDrawResultDto
            {
                Id = r.Id,
                GameId = r.GameId,
                DrawId = r.DrawId,
                WinningCategoryDescr = r.WinningCategoryDescr,
                SuccessesCount = r.SuccessesCount,
                DividentAmount = r.DividentAmount,
                TotalPayout = r.TotalPayout
            })
            .FirstOrDefaultAsync();

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }
}
