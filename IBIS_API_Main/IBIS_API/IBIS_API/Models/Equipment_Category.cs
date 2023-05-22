using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Equipment_Category
    {
        [Key]
        public int Equipment_Category_ID { get; set; }
        public string? Category { get; set; }
        public string? usage { get; set; } 




    }
}
