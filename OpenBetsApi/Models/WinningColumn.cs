using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OpenBetsApi.Models;

[Table("winning_columns")]
public class WinningColumn
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("game_id")]
    public int GameId { get; set; }

    [Required]
    [Column("draw_id")]
    public int DrawId { get; set; }

    [Required]
    [Column("draw_time")]
    public DateTime DrawTime { get; set; }

    [Required]
    [Column("n1")]
    [Range(1, 45)]
    public int N1 { get; set; }

    [Required]
    [Column("n2")]
    [Range(1, 45)]
    public int N2 { get; set; }

    [Required]
    [Column("n3")]
    [Range(1, 45)]
    public int N3 { get; set; }

    [Required]
    [Column("n4")]
    [Range(1, 45)]
    public int N4 { get; set; }

    [Required]
    [Column("n5")]
    [Range(1, 45)]
    public int N5 { get; set; }

    [Required]
    [Column("j1")]
    [Range(1, 20)]
    public int J1 { get; set; }

    [Column("winning_column_descr")]
    [MaxLength(100)]
    public string? WinningColumnDescr { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public virtual ICollection<GameDrawResult> DrawResults { get; set; } = new List<GameDrawResult>();
}
