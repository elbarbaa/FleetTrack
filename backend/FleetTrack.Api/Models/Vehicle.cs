namespace FleetTrack.Api.Models;

public class Vehicle
{
    public int Id { get; set; }

    public string Make { get; set; } = string.Empty;

    public string Model { get; set; } = string.Empty;

    public int Year { get; set; }

    public string? VIN { get; set; }
}