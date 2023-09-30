using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;
namespace IBIS_API.Models
{
    public class Permission
    {
        [Key]
        public int? Permission_ID { get; set; }
        public string? Name { get; set; }

        public virtual ICollection<AppUser>? AppUser { get; set; }
    }
}
