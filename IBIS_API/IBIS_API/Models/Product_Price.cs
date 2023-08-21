using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Product_Price
    {

        [Key]
        public int Product_Price_ID { get; set; }
	public float Price { get; set; }
	public float Discount { get; set; }
	//public virtual Discount Discount_ID {get;set;}



    }
}
