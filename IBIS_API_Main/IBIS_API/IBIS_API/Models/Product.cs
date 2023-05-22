using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Product
    {

        [Key]

    public int Product_ID { get; set; }
	public string? Product_Name { get; set; }
        public string? Category { get; set; }
        public string? Subcategory { get; set; }
        public string? Price { get; set; }
        public string? Quantity { get; set; }
        public string? Expiry { get; set; }
       // public virtual Product_Price? Product_Price_ID { get; set; }
	//public virtual Product_Status? Product_Status_ID { get; set; }
	//public virtual Product_Categories? Product_Categories_ID { get; set; }   









    }
}
