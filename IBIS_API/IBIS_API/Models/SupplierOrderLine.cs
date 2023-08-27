using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class SupplierOrderLine
    {
        [Key]
        public int? SupplierOrderLine_ID { get; set; }
        public int? Inventory_ID { get; set; }
       public  int? Supplier_Order_ID { get; set; }
        // supplier ID..
       public  double? Quantity { get; set; }
        public double? Price { get; set; }
     
    }
}
