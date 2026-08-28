using FleetTrack.Api.Data;
using FleetTrack.Api.Dtos;
using FleetTrack.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FleetTrack.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MaintenanceRecordsController : ControllerBase
{
    private readonly FleetTrackDbContext _context;

    public MaintenanceRecordsController(FleetTrackDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MaintenanceResponseDto>>> GetMaintenanceRecords()  //GET method
    {
        var records = await _context.MaintenanceRecords
            .Select(record => new MaintenanceResponseDto
            {
                Id = record.Id,
                VehicleId = record.VehicleId,
                Description = record.Description,
                Date = record.Date,
                Mileage = record.Mileage
            })
            .ToListAsync();

        return records;
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<MaintenanceResponseDto>> GetMaintenanceRecord(int id)   //GET with route parameter
    {
        var record = await _context.MaintenanceRecords.FindAsync(id);

        if (record == null)
        {
            return NotFound();
        }

        var response = new MaintenanceResponseDto
        {
            Id = record.Id,
            VehicleId = record.VehicleId,
            Description = record.Description,
            Date = record.Date,
            Mileage = record.Mileage
        };

        return response;
    }


    [HttpGet("vehicle/{vehicleId}")]
    public async Task<ActionResult<IEnumerable<MaintenanceResponseDto>>> GetMaintenanceRecordsByVehicle(  //GET by vehicle id instead of maintenanceid
        int vehicleId)
    {
        var records = await _context.MaintenanceRecords
            .Where(record => record.VehicleId == vehicleId)
            .ToListAsync();

        var response = records.Select(record => new MaintenanceResponseDto
        {
            Id = record.Id,
            VehicleId = record.VehicleId,
            Description = record.Description,
            Date = record.Date,
            Mileage = record.Mileage
        });

        return Ok(response);
    }
    

    [HttpPost]
    public async Task<ActionResult<MaintenanceResponseDto>> CreateMaintenanceRecord(
        MaintenanceCreateDto dto)
    {
        var record = new MaintenanceRecord
        {
            VehicleId = dto.VehicleId,
            Description = dto.Description,
            Date = dto.Date,
            Mileage = dto.Mileage
        };

        _context.MaintenanceRecords.Add(record);
        await _context.SaveChangesAsync();

        var response = new MaintenanceResponseDto
        {
            Id = record.Id,
            VehicleId = record.VehicleId,
            Description = record.Description,
            Date = record.Date,
            Mileage = record.Mileage
        };

        return CreatedAtAction(
            nameof(GetMaintenanceRecord),
            new { id = record.Id },
            response);
    }


    [HttpPut("{id}")]
    public async Task<ActionResult<MaintenanceResponseDto>> UpdateMaintenanceRecord(
        int id,
        MaintenanceCreateDto dto)
    {
        var existingRecord = await _context.MaintenanceRecords.FindAsync(id);

        if (existingRecord == null)
        {
            return NotFound();
        }

        existingRecord.VehicleId = dto.VehicleId;
        existingRecord.Description = dto.Description;
        existingRecord.Date = dto.Date;
        existingRecord.Mileage = dto.Mileage;

        await _context.SaveChangesAsync();

        var response = new MaintenanceResponseDto
        {
            Id = existingRecord.Id,
            VehicleId = existingRecord.VehicleId,
            Description = existingRecord.Description,
            Date = existingRecord.Date,
            Mileage = existingRecord.Mileage
        };

        return response;
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMaintenanceRecord(int id)
    {
        var record = await _context.MaintenanceRecords.FindAsync(id);

        if (record == null)
        {
            return NotFound();
        }

        _context.MaintenanceRecords.Remove(record);

        await _context.SaveChangesAsync();

        return NoContent();
    }

}