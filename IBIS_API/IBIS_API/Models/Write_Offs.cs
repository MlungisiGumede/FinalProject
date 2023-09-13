using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Write_Offs
    {
        [Key]

        public int Write_Off_Id { get; set; }

       public int? Product_ID { get; set; }
        public double? Quantity { get; set; }
        public string? Reason { get; set; }
        public string? Image { get; set; }

        public int? Adjustment_ID { get; set; }

        
        


    }
}
