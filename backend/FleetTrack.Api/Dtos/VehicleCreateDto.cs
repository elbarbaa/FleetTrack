using System.ComponentModel.DataAnnotations;

namespace FleetTrack.Api.Dtos;

public class VehicleCreateDto
{
    [Required]
    public string Make { get; set; } = string.Empty;

    [Required]
    public string Model { get; set; } = string.Empty;

    [Range(1900, 2100)]
    public int Year { get; set; }

    public string? VIN { get; set; }
}