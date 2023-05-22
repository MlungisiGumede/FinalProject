using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.Metrics;
using System.Numerics;

namespace IBIS_API.Models
{
    public partial class Supplier
    {

        [Key]
        public int Supplier_ID { get; set; }
        public string? postalcode { get; set; }
        public string? addressline { get; set; }

        public int address { get; set; }
        public string? CompanyName { get; set; }
        //[Address] varchar(255),
        public string? City { get; set; }
        public string? Region { get; set; }
        public string? Country { get; set; }
        public string? Phone { get; set; }

        //public virtual  Supplier_Order Supplier_Order_ID? { get; set; }
        //public virtual Supplier_Payment Supplier_Payment_ID? { get; set; } 
    }
}
