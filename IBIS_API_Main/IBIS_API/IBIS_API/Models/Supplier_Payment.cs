using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Supplier_Payment
    {
        [Key]
        public int Supplier_Payment_ID { get; set; }
	public string? Address { get; set; }
	public DateTime Date { get; set; }
    public virtual Payment_Method? Payment_Method_ID { get; set; }




    }
}
