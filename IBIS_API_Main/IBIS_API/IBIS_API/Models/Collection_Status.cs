using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Collection_Status
    {
        [Key]
        public int Collection_Status_ID { get; set; }
	    public Boolean Collected { get; set; }
    }
}
