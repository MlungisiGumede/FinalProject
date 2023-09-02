using System.ComponentModel.DataAnnotations;
namespace IBIS_API.Models { 
    
    public class CustomerOrderViewModel
    {
        [Key]
        public CustomerOrder? CustomerOrder { get; set; }
        public List<CustomerOrderLineViewModel>? CustomerOrderLines { get; set; }
    }
}
