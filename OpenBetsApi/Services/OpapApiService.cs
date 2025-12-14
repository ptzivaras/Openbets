using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using OpenBetsApi.Data;
using OpenBetsApi.Models;

namespace OpenBetsApi.Services;

public class OpapApiService
{
    private readonly HttpClient _httpClient;
    private readonly ApplicationDbContext _context;
    private readonly ILogger<OpapApiService> _logger;
    private const string OPAP_API_BASE = "https://api.opap.gr/draws/v3.0";

    public OpapApiService(
        HttpClient httpClient, 
        ApplicationDbContext context,
        ILogger<OpapApiService> logger)
    {
        _httpClient = httpClient;
        _context = context;
        _logger = logger;
    }

    public async Task<OpapDrawResponse?> FetchDrawFromOpap(int gameId, int drawId)
    {
        try
        {
            var url = $"{OPAP_API_BASE}/{gameId}/{drawId}";
            var response = await _httpClient.GetAsync(url);
            
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Failed to fetch draw {DrawId} for game {GameId}. Status: {Status}", 
                    drawId, gameId, response.StatusCode);
                return null;
            }

            var json = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<OpapDrawResponse>(json);
            
            return data;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching draw {DrawId} for game {GameId}", drawId, gameId);
            return null;
        }
    }

    public async Task<bool> SaveDrawToDatabase(OpapDrawResponse opapDraw)
    {
        try
        {
            // Check if already exists
            var exists = await _context.WinningColumns
                .AnyAsync(w => w.GameId == opapDraw.GameId && w.DrawId == opapDraw.DrawId);

            if (exists)
            {
                _logger.LogInformation("Draw {DrawId} already exists in database", opapDraw.DrawId);
                return false;
            }

            // Create WinningColumn
            var drawDateTime = DateTimeOffset.FromUnixTimeMilliseconds(opapDraw.DrawTime).UtcDateTime;
            
            var winningColumn = new WinningColumn
            {
                GameId = opapDraw.GameId,
                DrawId = opapDraw.DrawId,
                DrawTime = drawDateTime,
                N1 = opapDraw.WinningNumbers.List[0],
                N2 = opapDraw.WinningNumbers.List[1],
                N3 = opapDraw.WinningNumbers.List[2],
                N4 = opapDraw.WinningNumbers.List[3],
                N5 = opapDraw.WinningNumbers.List[4],
                J1 = opapDraw.WinningNumbers.Bonus[0],
                WinningColumnDescr = $"{opapDraw.WinningNumbers.List[0]},{opapDraw.WinningNumbers.List[1]},{opapDraw.WinningNumbers.List[2]},{opapDraw.WinningNumbers.List[3]},{opapDraw.WinningNumbers.List[4]}/{opapDraw.WinningNumbers.Bonus[0]}"
            };

            _context.WinningColumns.Add(winningColumn);
            await _context.SaveChangesAsync();

            // Create GameDrawResults
            foreach (var prize in opapDraw.PrizeCategories)
            {
                var gameDrawResult = new GameDrawResult
                {
                    GameId = opapDraw.GameId,
                    DrawId = opapDraw.DrawId,
                    WinningCategoryDescr = $"Category {prize.Id}",
                    SuccessesCount = prize.Winners,
                    DividentAmount = prize.Divident,
                    TotalPayout = prize.Distributed,
                    WinningColumnId = winningColumn.Id
                };

                _context.GameDrawResults.Add(gameDrawResult);
            }

            await _context.SaveChangesAsync();
            _logger.LogInformation("Successfully saved draw {DrawId} to database", opapDraw.DrawId);
            
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving draw {DrawId} to database", opapDraw.DrawId);
            return false;
        }
    }

    public async Task<bool> ImportDraw(int gameId, int drawId)
    {
        var drawData = await FetchDrawFromOpap(gameId, drawId);
        if (drawData == null)
            return false;

        return await SaveDrawToDatabase(drawData);
    }
}
