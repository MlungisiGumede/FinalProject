using System.ComponentModel.DataAnnotations;
namespace IBIS_API.Models
{
    public class Employee
    {
        [Key]

        public int? Employee_ID { get; set; } // optional as well?
        public string? FullName { get; set; }
        
       
        
        public string? Phone { get; set; }
        public string? Email { get; set; }
    }
}
