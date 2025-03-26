using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EquipmentMaintenance.API.Models;
using EquipmentMaintenance.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace EquipmentMaintenance.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EquipmentController : ControllerBase
    {
        private readonly EquipmentService _equipmentService;
        private readonly ILogger<EquipmentController> _logger;

        public EquipmentController(EquipmentService equipmentService, ILogger<EquipmentController> logger)
        {
            _equipmentService = equipmentService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<List<Equipment>>> GetAllEquipment()
        {
            var equipment = await _equipmentService.GetAllEquipment();
            return Ok(equipment);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Equipment>> GetEquipment(string id)
        {
            var equipment = await _equipmentService.GetEquipment(id);
            if (equipment == null)
            {
                return NotFound();
            }
            return Ok(equipment);
        }

        [HttpPost]
        public async Task<ActionResult<Equipment>> AddEquipment(Equipment equipment)
        {
            try
            {
                _logger.LogInformation("Received request to add equipment: {@Equipment}", JsonSerializer.Serialize(equipment, new JsonSerializerOptions { WriteIndented = true }));
                
                if (string.IsNullOrEmpty(equipment.Name))
                {
                    _logger.LogWarning("Attempted to add equipment with empty name");
                    return BadRequest(new { message = "Equipment name is required" });
                }

                if (string.IsNullOrEmpty(equipment.Type))
                {
                    _logger.LogWarning("Attempted to add equipment with empty type");
                    return BadRequest(new { message = "Equipment type is required" });
                }

                // Validate dates
                if (equipment.PurchaseDate == default)
                {
                    _logger.LogWarning("Attempted to add equipment with invalid purchase date");
                    return BadRequest(new { message = "Valid purchase date is required" });
                }

                if (equipment.LastMaintenanceDate == default)
                {
                    _logger.LogWarning("Attempted to add equipment with invalid last maintenance date");
                    return BadRequest(new { message = "Valid last maintenance date is required" });
                }

                if (equipment.NextMaintenanceDate == default)
                {
                    _logger.LogWarning("Attempted to add equipment with invalid next maintenance date");
                    return BadRequest(new { message = "Valid next maintenance date is required" });
                }

                var newEquipment = await _equipmentService.AddEquipment(equipment);
                _logger.LogInformation("Successfully added equipment with ID: {Id}", newEquipment.Id);
                return CreatedAtAction(nameof(GetEquipment), new { id = newEquipment.Id }, newEquipment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding equipment");
                return StatusCode(500, new { message = "An error occurred while adding the equipment", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Equipment>> UpdateEquipment(string id, Equipment equipment)
        {
            if (id != equipment.Id)
            {
                return BadRequest(new { message = "ID mismatch" });
            }
            var updatedEquipment = await _equipmentService.UpdateEquipment(equipment);
            return Ok(updatedEquipment);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteEquipment(string id)
        {
            await _equipmentService.DeleteEquipment(id);
            return NoContent();
        }

        [HttpGet("maintenance-tasks")]
        public async Task<ActionResult<IEnumerable<MaintenanceTask>>> GetAllMaintenanceTasks()
        {
            var tasks = await _equipmentService.GetAllMaintenanceTasks();
            return Ok(tasks);
        }
    }
} 