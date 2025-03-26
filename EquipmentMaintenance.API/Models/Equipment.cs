using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace EquipmentMaintenance.API.Models
{
    public class Equipment
    {
        [JsonPropertyName("id")]
        public string? Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("type")]
        public string Type { get; set; }

        [JsonPropertyName("maintenanceTasks")]
        public List<MaintenanceTask> MaintenanceTasks { get; set; } = new List<MaintenanceTask>();

        [JsonPropertyName("maintenanceHistory")]
        public List<MaintenanceHistory> MaintenanceHistory { get; set; } = new List<MaintenanceHistory>();
    }
} 