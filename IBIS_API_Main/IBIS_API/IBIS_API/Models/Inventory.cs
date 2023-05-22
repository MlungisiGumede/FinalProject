using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public partial class Inventory
	{
        [Key]
        public int Inventory_ID { get; set; }
        public string? SKU { get; set; }
        public string? ItemName { get; set; }
        public string? SupplierID { get; set; }
        public string? Quantity { get; set; }
        public string? Invoice { get; set; }
        // public virtual Inventory_Item? Inventory_Item_ID {get; set;}
        public string? Products { get; set; }    
	public string? Inventory_Items { get; set; }
    //public virtual Stock_On_Hand? Stock_On_Hand_ID { get; set; }
    //public virtual Product? Product_ID { get; set; }

    //public virtual User_Account? User_Account_ID { get; set; }

    //public virtual Equipment? Equipment_ID { get; set; }

    }
}
