using System.ComponentModel.DataAnnotations;
namespace IBIS_API.Models { 
    

    public class CustomerOrder
    {
        [Key]
        public int? CustomerOrder_ID { get; set; }
        public int? Customer_ID { get; set; }
        public String? Date_Created { get; set; }

        public String? OrderStatus_ID { get; set; }
        //public List<CustomerOrderLine> CustomerOrderLines { get; set; }
    }
}
