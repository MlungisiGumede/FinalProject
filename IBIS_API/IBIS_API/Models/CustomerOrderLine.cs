using System.ComponentModel.DataAnnotations;
namespace IBIS_API.Models
{
    public class CustomerOrderLine
    {
        [Key]
        public int CustomerOrderLine_ID { get; set; }
        public int? Customer_Order_ID { get; set; }
        public int? Product_ID { get; set; }
        public double Quantity { get; set; }
        public double Price { get; set; }

    }
}
