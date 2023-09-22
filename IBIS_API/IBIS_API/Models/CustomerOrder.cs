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

        public int? PaymentType_ID { get; set; } // this be here... or...

        public String? Transaction_ID { get; set; }

        public String? Review { get; set; }

        public int? ReviewClassification_ID { get; set; }

        public virtual ICollection<Product>? Product { get; set; }
        //public List<CustomerOrderLine> CustomerOrderLines { get; set; }
    }
}
