using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Supplier_Order
    {
        [Key]
        public int  Supplier_Order_ID { get; set; }
   public int? Quantity { get; set; }
   //public virtual Supplier_Order_Status? Supplier_Order_Status_ID { get; set; }
    }
}
