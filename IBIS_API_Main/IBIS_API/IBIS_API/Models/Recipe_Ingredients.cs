using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Recipe_Ingredients
    {
        [Key]

        public int Recipe_Ingredients_ID { get; set; }
	public virtual Product? Product_ID { get; set; }
	public string? Products_Quantity { get; set; }
	public string? Ingredient { get; set; }
    }
}
