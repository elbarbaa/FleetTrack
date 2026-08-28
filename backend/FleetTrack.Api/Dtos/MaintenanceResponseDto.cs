namespace FleetTrack.Api.Dtos;

public class MaintenanceResponseDto
{
    public int Id { get; set; }
    public int VehicleId { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateOnly Date { get; set; }
    public int Mileage { get; set; }
}