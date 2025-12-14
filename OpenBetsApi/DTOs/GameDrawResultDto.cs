namespace OpenBetsApi.DTOs;

public class GameDrawResultDto
{
    public int Id { get; set; }
    public int GameId { get; set; }
    public int DrawId { get; set; }
    public string WinningCategoryDescr { get; set; } = string.Empty;
    public int? SuccessesCount { get; set; }
    public decimal? DividentAmount { get; set; }
    public decimal? TotalPayout { get; set; }
}

public class CreateGameDrawResultDto
{
    public int GameId { get; set; }
    public int DrawId { get; set; }
    public string WinningCategoryDescr { get; set; } = string.Empty;
    public int? SuccessesCount { get; set; }
    public decimal? DividentAmount { get; set; }
    public decimal? TotalPayout { get; set; }
    public int? WinningColumnId { get; set; }
}
