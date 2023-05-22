using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Supplier_Order_Status
    {
        [Key]
    public int Supplier_Order_Status_ID { get; set; }
	public Boolean? Approved { get; set; }

    }
}
