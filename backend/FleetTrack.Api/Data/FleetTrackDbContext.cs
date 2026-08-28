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
}