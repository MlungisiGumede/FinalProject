namespace IBIS_API.Models
{
    public class ProductVM
    {
        public int Product_ID { get; set; }
        public string? Name { get; set; }

        public double? Quantity { get; set; }

        public double? QuantityAfterOrders { get; set; }
    }
}
