using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.Metrics;

namespace IBIS_API.Models
{
    [PrimaryKey(nameof(CustomerOrder_ID), nameof(Product_ID))]
    //[ForeignKey(nameof(CustomerOrder_ID), nameof(Product_ID))]
    public class CustomerOrderLine
    {
        [Column(Order = 0)]
        public int CustomerOrder_ID { get; set; }

       [Column(Order = 1)]

        public int Product_ID { get; set; }
        public virtual Product Product { get; set; }
        public virtual CustomerOrder CustomerOrder { get; set; }

        public double  Quantity { get; set; }
        public double  Price { get; set; }

    }
}
