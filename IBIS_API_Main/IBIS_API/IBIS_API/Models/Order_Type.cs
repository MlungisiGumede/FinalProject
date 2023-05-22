using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Order_Type
    {

        [Key]
        public int Order_Type_ID { get; set; }
	public string? TypeName { get; set; }
	public string? Description { get; set; }
      
    }
}
