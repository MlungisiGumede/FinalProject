using System.ComponentModel.DataAnnotations;
namespace IBIS_API.Models
{
    public class Adjustment
    {
        [Key]
    public int? Adjustment_ID { get; set; }
     public string? Name  { get; set; }
    }
}
