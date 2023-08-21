using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Inventory_Price
       

    {
        [Key]

        public int Inventory_Price_ID { get; set; } 
        public string? Inventory_Price_Name { get; set; }        
    }
}
