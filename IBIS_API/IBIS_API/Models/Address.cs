using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Address
    {
        [Key]
        public int addressId { get; set; }
        public string? postalcode { get; set; }
        public string? addressline { get; set; }

    }
}
