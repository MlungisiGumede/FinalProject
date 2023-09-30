using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.Metrics;
namespace IBIS_API.Models
{
    [PrimaryKey(nameof(userName), nameof(Permission_Id))]
    public class UserPermissions
    {
        [Key]
        [Column(Order = 0)]
        public string? userName {  get; set; }

        [Column(Order = 1)]
        public int? Permission_Id { get; set; }

        public virtual AppUser AppUser { get; set; }
        public virtual Permission Permission { get; set; }
    }
}
