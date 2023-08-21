using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Order
	{
        [Key]
        public int Order_ID { get; set; }	
	//public virtual Order_Type? Order_Type_ID { get; set; }	
	//public virtual Product? Product_ID { get; set; }	
	public int? Quantity { get; set; }	

   public int? supplier { get; set; }	

	public string? supplierName {get; set; }

public string? Order_Status { get; set; }
	//public virtual Discount Discount_ID { get; set; }
	//public virtual Order_Details? Order_Details_ID { get; set; }	

		//public Customer? Customer {get; set; }

		//public int Customer_ID {get; set; }


    }
}
