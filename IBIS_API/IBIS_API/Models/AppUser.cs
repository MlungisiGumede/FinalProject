using Microsoft.AspNetCore.Identity;
using System.Security;

namespace IBIS_API.Models
{
    public class AppUser: IdentityUser
    {
        
         public String? FullName { get; set; }
        //public List<PermissionSet> Permissions { get; set; }
        public double? timerSettings { get; set; }

        public virtual ICollection<Permission>? Permission { get; set; }
    }
}