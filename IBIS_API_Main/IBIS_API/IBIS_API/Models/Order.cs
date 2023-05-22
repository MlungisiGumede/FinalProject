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
	public int Quantity { get; set; }	
	//public virtual Discount Discount_ID { get; set; }
	//public virtual Order_Details? Order_Details_ID { get; set; }	




    }
}
