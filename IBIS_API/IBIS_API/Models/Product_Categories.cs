using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Product_Categories
    {

        [Key]
    public int Product_Categories_ID { get; set; }
	public string? Product_Category { get; set; }
	public string? Description { get; set; }





    }
}
