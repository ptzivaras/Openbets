namespace OpenBetsApi.DTOs;

public class WinningColumnDto
{
    public int Id { get; set; }
    public int GameId { get; set; }
    public int DrawId { get; set; }
    public DateTime DrawTime { get; set; }
    public int N1 { get; set; }
    public int N2 { get; set; }
    public int N3 { get; set; }
    public int N4 { get; set; }
    public int N5 { get; set; }
    public int J1 { get; set; }
    public string? WinningColumnDescr { get; set; }
}

public class CreateWinningColumnDto
{
    public int GameId { get; set; }
    public int DrawId { get; set; }
    public DateTime DrawTime { get; set; }
    public int N1 { get; set; }
    public int N2 { get; set; }
    public int N3 { get; set; }
    public int N4 { get; set; }
    public int N5 { get; set; }
    public int J1 { get; set; }
    public string? WinningColumnDescr { get; set; }
}
