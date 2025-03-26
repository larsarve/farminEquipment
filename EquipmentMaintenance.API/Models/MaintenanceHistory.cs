using System;
using System.Text.Json.Serialization;

namespace EquipmentMaintenance.API.Models
{
    public class MaintenanceHistory
    {
        [JsonPropertyName("id")]
        public string? Id { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("completedDate")]
        public DateTime CompletedDate { get; set; }

        [JsonPropertyName("equipmentId")]
        public string EquipmentId { get; set; }
    }
} 