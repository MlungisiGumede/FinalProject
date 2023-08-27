using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class OrderStatus
    {

        [Key]

        public int? OrderStatus_ID { get; set; }
	//public virtual Order? Order_ID { get; set; }
	public String? Name { get; set; }








    }
}
