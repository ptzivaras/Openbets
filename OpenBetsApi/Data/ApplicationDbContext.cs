using Microsoft.EntityFrameworkCore;
using OpenBetsApi.Models;

namespace OpenBetsApi.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<WinningColumn> WinningColumns { get; set; }
    public DbSet<GameDrawResult> GameDrawResults { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure WinningColumn
        modelBuilder.Entity<WinningColumn>(entity =>
        {
            entity.HasIndex(e => new { e.GameId, e.DrawId })
                  .HasDatabaseName("idx_winning_columns_game_draw");
            
            entity.HasIndex(e => e.DrawTime)
                  .HasDatabaseName("idx_winning_columns_draw_time");
        });

        // Configure GameDrawResult
        modelBuilder.Entity<GameDrawResult>(entity =>
        {
            entity.HasIndex(e => new { e.GameId, e.DrawId })
                  .HasDatabaseName("idx_game_draw_results_game_draw");
            
            entity.HasOne(d => d.WinningColumn)
                  .WithMany(p => p.DrawResults)
                  .HasForeignKey(d => d.WinningColumnId)
                  .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
