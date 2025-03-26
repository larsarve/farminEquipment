using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using EquipmentMaintenance.API.Models;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace EquipmentMaintenance.API.Services
{
    public class EquipmentService
    {
        private readonly string _dataFilePath;
        private List<Equipment> _equipment;
        private readonly ILogger<EquipmentService> _logger;

        public EquipmentService(ILogger<EquipmentService> logger)
        {
            _logger = logger;
            _dataFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "equipment_data.json");
            LoadData();
        }

        private void LoadData()
        {
            try
            {
                if (File.Exists(_dataFilePath))
                {
                    var json = File.ReadAllText(_dataFilePath);
                    _equipment = JsonSerializer.Deserialize<List<Equipment>>(json) ?? new List<Equipment>();
                    _logger.LogInformation($"Loaded {_equipment.Count} equipment items from {_dataFilePath}");
                }
                else
                {
                    _equipment = new List<Equipment>();
                    _logger.LogInformation($"No existing data file found at {_dataFilePath}. Starting with empty list.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading equipment data");
                _equipment = new List<Equipment>();
            }
        }

        private async Task SaveData()
        {
            try
            {
                var json = JsonSerializer.Serialize(_equipment);
                await File.WriteAllTextAsync(_dataFilePath, json);
                _logger.LogInformation($"Saved {_equipment.Count} equipment items to {_dataFilePath}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving equipment data");
                throw;
            }
        }

        public async Task<List<Equipment>> GetAllEquipment()
        {
            return _equipment;
        }

        public async Task<Equipment> GetEquipment(string id)
        {
            return _equipment.Find(e => e.Id == id);
        }

        public async Task<Equipment> AddEquipment(Equipment equipment)
        {
            try
            {
                equipment.Id = Guid.NewGuid().ToString();
                _equipment.Add(equipment);
                await SaveData();
                _logger.LogInformation($"Added new equipment with ID: {equipment.Id}");
                return equipment;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding equipment");
                throw;
            }
        }

        public async Task<Equipment> UpdateEquipment(Equipment equipment)
        {
            try
            {
                var index = _equipment.FindIndex(e => e.Id == equipment.Id);
                if (index != -1)
                {
                    _equipment[index] = equipment;
                    await SaveData();
                    _logger.LogInformation($"Updated equipment with ID: {equipment.Id}");
                }
                return equipment;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating equipment");
                throw;
            }
        }

        public async Task DeleteEquipment(string id)
        {
            try
            {
                _equipment.RemoveAll(e => e.Id == id);
                await SaveData();
                _logger.LogInformation($"Deleted equipment with ID: {id}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting equipment");
                throw;
            }
        }

        public async Task<List<MaintenanceTask>> GetAllMaintenanceTasks()
        {
            var tasks = new List<MaintenanceTask>();
            foreach (var equipment in _equipment)
            {
                tasks.AddRange(equipment.MaintenanceTasks);
            }
            return tasks;
        }
    }
} 