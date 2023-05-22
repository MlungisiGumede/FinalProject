using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Inventory_item_Price
    {
        [Key]
   public int Inventory_Item_Price_ID { get; set; } 
   public int Inventroy_Item_Price { get; set; }

    }
}
