using Newtonsoft.Json.Converters;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

namespace IBIS_API.Models {
    public class CustomerOrder
    {
        [Key]
        public int? CustomerOrder_ID { get; set; }
        public int? Customer_ID { get; set; }

       
        public String? Date_Created { get; set; }

        public int? OrderStatus_ID { get; set; }
        //public List<CustomerOrderLine> CustomerOrderLines { get; set; }
    }
}
