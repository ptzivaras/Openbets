using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpenBetsApi.Data;
using OpenBetsApi.DTOs;
using OpenBetsApi.Models;

namespace OpenBetsApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WinningColumnsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public WinningColumnsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/WinningColumns
    [HttpGet]
    public async Task<ActionResult<IEnumerable<WinningColumnDto>>> GetWinningColumns(
        [FromQuery] int? gameId = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _context.WinningColumns.AsQueryable();

        if (gameId.HasValue)
        {
            query = query.Where(w => w.GameId == gameId.Value);
        }

        var totalCount = await query.CountAsync();
        
        var columns = await query
            .OrderByDescending(w => w.DrawTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(w => new WinningColumnDto
            {
                Id = w.Id,
                GameId = w.GameId,
                DrawId = w.DrawId,
                DrawTime = w.DrawTime,
                N1 = w.N1,
                N2 = w.N2,
                N3 = w.N3,
                N4 = w.N4,
                N5 = w.N5,
                J1 = w.J1,
                WinningColumnDescr = w.WinningColumnDescr
            })
            .ToListAsync();

        Response.Headers.Append("X-Total-Count", totalCount.ToString());
        Response.Headers.Append("X-Page", page.ToString());
        Response.Headers.Append("X-Page-Size", pageSize.ToString());

        return Ok(columns);
    }

    // GET: api/WinningColumns/5
    [HttpGet("{id}")]
    public async Task<ActionResult<WinningColumnDto>> GetWinningColumn(int id)
    {
        var column = await _context.WinningColumns
            .Where(w => w.Id == id)
            .Select(w => new WinningColumnDto
            {
                Id = w.Id,
                GameId = w.GameId,
                DrawId = w.DrawId,
                DrawTime = w.DrawTime,
                N1 = w.N1,
                N2 = w.N2,
                N3 = w.N3,
                N4 = w.N4,
                N5 = w.N5,
                J1 = w.J1,
                WinningColumnDescr = w.WinningColumnDescr
            })
            .FirstOrDefaultAsync();

        if (column == null)
        {
            return NotFound();
        }

        return Ok(column);
    }

    // POST: api/WinningColumns
    [HttpPost]
    public async Task<ActionResult<WinningColumnDto>> CreateWinningColumn(CreateWinningColumnDto dto)
    {
        var column = new WinningColumn
        {
            GameId = dto.GameId,
            DrawId = dto.DrawId,
            DrawTime = dto.DrawTime,
            N1 = dto.N1,
            N2 = dto.N2,
            N3 = dto.N3,
            N4 = dto.N4,
            N5 = dto.N5,
            J1 = dto.J1,
            WinningColumnDescr = dto.WinningColumnDescr
        };

        _context.WinningColumns.Add(column);
        await _context.SaveChangesAsync();

        var result = new WinningColumnDto
        {
            Id = column.Id,
            GameId = column.GameId,
            DrawId = column.DrawId,
            DrawTime = column.DrawTime,
            N1 = column.N1,
            N2 = column.N2,
            N3 = column.N3,
            N4 = column.N4,
            N5 = column.N5,
            J1 = column.J1,
            WinningColumnDescr = column.WinningColumnDescr
        };

        return CreatedAtAction(nameof(GetWinningColumn), new { id = column.Id }, result);
    }

    // GET: api/WinningColumns/latest
    [HttpGet("latest")]
    public async Task<ActionResult<WinningColumnDto>> GetLatestWinningColumn([FromQuery] int gameId = 5104)
    {
        var column = await _context.WinningColumns
            .Where(w => w.GameId == gameId)
            .OrderByDescending(w => w.DrawTime)
            .Select(w => new WinningColumnDto
            {
                Id = w.Id,
                GameId = w.GameId,
                DrawId = w.DrawId,
                DrawTime = w.DrawTime,
                N1 = w.N1,
                N2 = w.N2,
                N3 = w.N3,
                N4 = w.N4,
                N5 = w.N5,
                J1 = w.J1,
                WinningColumnDescr = w.WinningColumnDescr
            })
            .FirstOrDefaultAsync();

        if (column == null)
        {
            return NotFound(new { message = "No draws found" });
        }

        return Ok(column);
    }
}
