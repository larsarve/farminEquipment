using System;
using System.Text.Json.Serialization;

namespace EquipmentMaintenance.API.Models
{
    public class MaintenanceTask
    {
        [JsonPropertyName("id")]
        public string? Id { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("dueDate")]
        public DateTime DueDate { get; set; }

        [JsonPropertyName("isCompleted")]
        public bool IsCompleted { get; set; }

        [JsonPropertyName("equipmentId")]
        public string EquipmentId { get; set; }

        [JsonPropertyName("equipmentName")]
        public string EquipmentName { get; set; }
    }
} 