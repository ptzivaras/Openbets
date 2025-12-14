using System.Text.Json.Serialization;

namespace OpenBetsApi.Services;

// OPAP API Response Models
public class OpapDrawResponse
{
    [JsonPropertyName("gameId")]
    public int GameId { get; set; }

    [JsonPropertyName("drawId")]
    public int DrawId { get; set; }

    [JsonPropertyName("drawTime")]
    public long DrawTime { get; set; }

    [JsonPropertyName("winningNumbers")]
    public WinningNumbersData WinningNumbers { get; set; } = new();

    [JsonPropertyName("prizeCategories")]
    public List<PrizeCategory> PrizeCategories { get; set; } = new();
}

public class WinningNumbersData
{
    [JsonPropertyName("list")]
    public List<int> List { get; set; } = new();

    [JsonPropertyName("bonus")]
    public List<int> Bonus { get; set; } = new();
}

public class PrizeCategory
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("divident")]
    public decimal? Divident { get; set; }

    [JsonPropertyName("winners")]
    public int? Winners { get; set; }

    [JsonPropertyName("distributed")]
    public decimal? Distributed { get; set; }
}
