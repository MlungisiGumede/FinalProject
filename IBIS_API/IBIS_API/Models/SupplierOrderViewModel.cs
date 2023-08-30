using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;
namespace IBIS_API.Models
{ 
    public class SupplierOrderViewModel
    {
        [Key]
        public SupplierOrder SupplierOrder { get; set; }
        public List<SupplierOrderLineViewModel>? SupplierOrderLines { get; set; }
    }
}
