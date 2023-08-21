using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
	public class Order_Details
    {
        [Key]

        public int Order_Details_ID { get; set; }   
	public string? Customer { get; set; }
    public int? Quantity { get; set; }
    public string? Products { get; set; }

   // public virtual Product? Product_ID { get; set; }

   // public virtual Inventory_Item? Order_Status_ID { get; set; }





    }
}
