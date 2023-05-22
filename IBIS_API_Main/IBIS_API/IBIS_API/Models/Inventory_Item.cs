using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Inventory_Item
	{
        [Key]
        public int Inventory_Item_ID { get; set; }	
	Inventory_Item? Inventory_ID { get; set; }	
	public string? Category { get; set; }
	public int Quantity { get; set; }
	public virtual Supplier? Supplier_ID { get; set; }	
	public virtual Expiry? Expiry_Date_ID { get; set; }
    public virtual Inventory_Type? Inventory_Item_Type_ID { get; set; }
    public virtual Inventory_item_Price? Inventory_Item_Price_ID { get; set; }










    }
}
