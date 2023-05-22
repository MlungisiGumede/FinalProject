using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Stock_On_Hand
    {
        [Key]
        public int Stock_On_Hand_ID { get; set; }
	public virtual Inventory_Item? Inventory_Item_ID { get; set; }
	public Boolean? Instock { get; set; }
    public int Quantity { get; set; }



    }
}
