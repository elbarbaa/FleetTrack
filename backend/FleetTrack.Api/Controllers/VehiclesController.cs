using FleetTrack.Api.Data;
using FleetTrack.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FleetTrack.Api.Dtos;

namespace FleetTrack.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehiclesController : ControllerBase
{
    private readonly FleetTrackDbContext _context;

    public VehiclesController(FleetTrackDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<VehicleResponseDto>>> GetVehicles()  //GET method with DTO response (so we do not expose fields that are to be kept private)
    {
        var vehicles = await _context.Vehicles
            .Select(vehicle => new VehicleResponseDto
            {
                Id = vehicle.Id,
                Make = vehicle.Make,
                Model = vehicle.Model,
                Year = vehicle.Year,
                VIN = vehicle.VIN
            })
            .ToListAsync();
        return vehicles;
    }


    [HttpPost]
    public async Task<ActionResult<Vehicle>> CreateVehicle(VehicleCreateDto dto)    //POST method (using DTO for validation)
    {
        var vehicle = new Vehicle
        {
            Make = dto.Make,
            Model = dto.Model,
            Year = dto.Year,
            VIN = dto.VIN
        };
        
        _context.Vehicles.Add(vehicle);
        await _context.SaveChangesAsync();

        var response = new VehicleResponseDto
        {
            Id = vehicle.Id,
            Make = vehicle.Make,
            Model = vehicle.Model,Year = vehicle.Year,
            VIN = vehicle.VIN
        };
        
        return CreatedAtAction(nameof(GetVehicle), new { id = vehicle.Id }, response);


    }


    [HttpGet("{id}")]
    public async Task<ActionResult<VehicleResponseDto>> GetVehicle(int id)   //GET (1) with route parameter and ressponse dto
    {
        var vehicle = await _context.Vehicles
            .Where(vehicle => vehicle.Id == id)
            .Select(vehicle => new VehicleResponseDto
            {
                Id = vehicle.Id,
                Make = vehicle.Make,
                Model = vehicle.Model,
                Year = vehicle.Year,
                VIN = vehicle.VIN
            })
            .FirstOrDefaultAsync();

            if (vehicle == null)
            {
                return NotFound();
            }
            
            return vehicle;
    }


    [HttpPut("{id}")]
    public async Task<ActionResult<VehicleResponseDto>> UpdateVehicle(int id,VehicleCreateDto dto)
    {
        var existingVehicle = await _context.Vehicles.FindAsync(id);
        if (existingVehicle == null)
        {
            return NotFound();
        }

        existingVehicle.Make = dto.Make;
        existingVehicle.Model = dto.Model;
        existingVehicle.Year = dto.Year;
        existingVehicle.VIN = dto.VIN;

        await _context.SaveChangesAsync();

        var response = new VehicleResponseDto
        {
            Id = existingVehicle.Id,
            Make = existingVehicle.Make,
            Model = existingVehicle.Model,
            Year = existingVehicle.Year,
            VIN = existingVehicle.VIN
        };

        return response;
    }



    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVehicle(int id)   //DELETE method 
    {
        var vehicle = await _context.Vehicles.FindAsync(id);
        if (vehicle == null)
        {
            return NotFound();
        }
        _context.Vehicles.Remove(vehicle);
        await _context.SaveChangesAsync();
        return NoContent();
    }






}