namespace IBIS_API.Models
{
    public class SupplierOrderLineViewModel
    {
        public int? SupplierOrder_ID { get; set; }
        public int? Inventory_ID { get; set; }
        public double Price { get; set; }

        public double Quantity { get; set; }
    }
}
