using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OpenBetsApi.Models;

[Table("game_draw_results")]
public class GameDrawResult
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
    [Column("winning_category_descr")]
    [MaxLength(100)]
    public string WinningCategoryDescr { get; set; } = string.Empty;

    [Column("successes_cnt")]
    public int? SuccessesCount { get; set; }

    [Column("divident_amn", TypeName = "decimal(18,2)")]
    public decimal? DividentAmount { get; set; }

    [Column("total_payout", TypeName = "decimal(18,2)")]
    public decimal? TotalPayout { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Foreign key
    [Column("winning_column_id")]
    public int? WinningColumnId { get; set; }

    // Navigation property
    [ForeignKey("WinningColumnId")]
    public virtual WinningColumn? WinningColumn { get; set; }
}
