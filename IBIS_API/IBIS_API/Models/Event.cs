using System.ComponentModel.DataAnnotations;
namespace IBIS_API.Models
{
    public class Event
    {
        [Key]
        public int? Id { get; set; }

        public string? Date { get; set; }
        public string? Description { get; set; }
    }
}
