
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.Metrics;

namespace IBIS_API.Models
{
    [PrimaryKey(nameof(SupplierOrder_ID), nameof(Inventory_ID))]
    public class SupplierOrderLine
    {
        [Key]
        [Column(Order = 0)]
        public int SupplierOrder_ID { get; set; }

        [Column(Order = 1)]
        public int Inventory_ID { get; set; }
        // supplier ID..

       
        public virtual SupplierOrder SupplierOrder { get; set; }

        public virtual Inventory Inventory { get; set; }
        public  double? Quantity { get; set; }
        public double? Price { get; set; }
     
    }
}






   
    //[ForeignKey(nameof(CustomerOrder_ID), nameof(Product_ID))]


