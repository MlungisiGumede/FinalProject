using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Equipment_Maintenance
    {
        [Key]
        public int Equipment_Maintenance_ID { get; set; }   
	public int? Duration { get; set; }   
	public float? Cost { get; set; } 
    }
}
