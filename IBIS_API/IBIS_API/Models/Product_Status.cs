using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Product_Status
    {

        [Key]
    public int Product_Status_ID { get; set; }
	public Boolean InProduction { get; set; }
	public Boolean Finished { get; set; }
    }
}
