namespace IBIS_API.Models
{
    public class CustomerOrderLineViewModel
    {
        public int? CustomerOrder_ID { get; set; }
        public int? Product_ID { get; set; }
        public double Price { get; set; }

        public double Quantity { get; set; }

    }
}
