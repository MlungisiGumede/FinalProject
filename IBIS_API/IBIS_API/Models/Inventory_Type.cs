using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Inventory_Type
    {
        [Key]
        public int Inventory_Item_Type_ID { get; set; } 
	public string? Inventory_type { get; set; }  
	public DateTime? shipment_date { get; set; } 





    }
}
