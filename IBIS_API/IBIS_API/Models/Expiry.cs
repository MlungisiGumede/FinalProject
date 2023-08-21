using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Expiry
    {
        [Key]
        public int Expiry_ID { get; set; }  
	public DateTime? Expire_Date { get; set; }   
    public Boolean? expired { get; set; }  
    }
}
