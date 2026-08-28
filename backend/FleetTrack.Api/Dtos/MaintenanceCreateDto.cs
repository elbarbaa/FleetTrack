using System.ComponentModel.DataAnnotations;

namespace FleetTrack.Api.Dtos;

public class MaintenanceCreateDto
{
    [Required]
    public int VehicleId { get; set; }

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public DateOnly Date { get; set; }

    [Range(0, 2000000)]
    public int Mileage { get; set; }
}