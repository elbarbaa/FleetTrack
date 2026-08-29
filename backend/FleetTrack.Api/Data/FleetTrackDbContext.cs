using FleetTrack.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FleetTrack.Api.Data;

public class FleetTrackDbContext : DbContext
{
    public FleetTrackDbContext(DbContextOptions<FleetTrackDbContext> options)
        : base(options)
    {
    }

    public DbSet<Vehicle> Vehicles { get; set; }

    public DbSet<MaintenanceRecord> MaintenanceRecords { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)  //database level foreign key instad of it being application enforced only
    {
        modelBuilder.Entity<MaintenanceRecord>()
            .HasOne<Vehicle>()
            .WithMany()
            .HasForeignKey(m => m.VehicleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}