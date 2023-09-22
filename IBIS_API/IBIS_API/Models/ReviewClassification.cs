using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;
namespace IBIS_API.Models
{
    public class ReviewClassification
    {
        [Key]
        public int? ReviewClassification_ID { get; set; }
        public string Name { get; set; }
    }
}
