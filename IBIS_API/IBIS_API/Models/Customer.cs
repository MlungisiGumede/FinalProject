using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Customer
    {
        [Key]
        public int? Customer_ID {get; set;} // optional as well?
        public string? Customer_FirstName { get; set; }
        public string? Customer_Surname { get; set; }
        //public List<Order>? Orders { get; set; }
        //public virtual Address? Address { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        




    }
}
