using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Order_Status
    {

        [Key]

        public int Order_Status_ID { get; set; }
	public virtual Order? Order_ID { get; set; }
	public Boolean IsCompleted { get; set; }








    }
}
