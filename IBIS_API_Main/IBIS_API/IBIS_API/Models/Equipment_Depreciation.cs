using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Equipment_Depreciation
    {
        [Key]
        public int Equipment_Depreciation_ID { get; set; }   

	public int Amount { get; set; }
	public string? Years { get; set; }
    }
}
