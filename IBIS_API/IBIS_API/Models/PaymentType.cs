using System.ComponentModel.DataAnnotations;
namespace IBIS_API.Models
{
    public class PaymentType
    {
        [Key]
        public int? PaymentType_ID { get; set; }
        public string? Name { get; set; }
    }
}
