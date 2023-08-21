using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Payment_Method
    {

        [Key]

        public int Payment_Method_ID { get; set; }
	public string? method { get; set; }




    }
}
