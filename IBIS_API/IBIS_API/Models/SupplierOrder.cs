using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class SupplierOrder
    {
        [Key]
        public int? SupplierOrder_ID { get; set; }
        public int? Supplier_ID { get; set; }
       

        public int? OrderStatus_ID { get; set; }

        public String? Date_Created { get; set; }

        public String? Date_Sold { get; set; }

        public String? Date_Cancelled { get; set; }
        //public List<SupplierOrderLine> SupplierOrderLines { get; set; }
        //public virtual Supplier_Order_Status? Supplier_Order_Status_ID { get; set; }
    }
}
