using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Recipe
    {

        [Key]
    public int Recipe_ID { get; set; }
	public string? Product_Id { get; set; }
	public int? Products_Quantity { get; set; }
    public string? Recipe_Ingredients { get; set; }
	public int? Time_Required { get; set; }
	public string? Recipe_Name { get; set; }






    }
}
