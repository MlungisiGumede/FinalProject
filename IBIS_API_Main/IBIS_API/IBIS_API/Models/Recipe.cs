using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Recipe
    {

        [Key]
    public int Recipe_ID { get; set; }
	public virtual Product? Product_ID { get; set; }
	public int Products_Quantity { get; set; }
    public virtual Recipe_Ingredients? Recipe_Ingredient_ID { get; set; }
	public int Time_Required { get; set; }
	public string? Recipe_Name { get; set; }






    }
}
