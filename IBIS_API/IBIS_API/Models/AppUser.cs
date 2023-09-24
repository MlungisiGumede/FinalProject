using Microsoft.AspNetCore.Identity;

namespace IBIS_API.Models
{
    public class AppUser: IdentityUser
    {
         public String? FullName { get; set; }
         public Boolean? Permissions { get; set; }
    }
}