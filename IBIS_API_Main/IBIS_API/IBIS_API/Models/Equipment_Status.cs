using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Equipment_Status
    {
        [Key]
        public int Equipment_Status_ID { get; set; }
	public int Useful_Life { get; set; }    
    }
}
