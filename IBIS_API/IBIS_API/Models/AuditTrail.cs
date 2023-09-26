using System.ComponentModel.DataAnnotations;
namespace IBIS_API.Models
{
    public class AuditTrail
    {
        [Key]
        public int? Id { get; set; }
        public string? Name { get; set; }

        public string? User { get; set; }

        public DateTime? Date { get; set; }


        public string? Description { get; set; }
    }
}
