using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Equipment
	{
        [Key]
        public int Equipment_ID { get; set; }
    //public virtual Equipment_Category? Equipment_Category_ID { get; set; }
	public string? Products { get; set; }	
	//public virtual Equipment_Maintenance? Equipment_Maintenance_ID { get; set; }
    //public virtual Equipment_Status? Equipment_Status_ID { get; set; }
    public string? Equip_Name { get; set; }  

	//public virtual Equipment_Depreciation? Equipment_Depreciation_ID { get; set; }  












    }
}
