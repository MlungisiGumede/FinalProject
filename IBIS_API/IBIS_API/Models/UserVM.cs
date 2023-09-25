namespace IBIS_API.Models
{
    public class UserVM
    {
        public String? Id { get; set; }
        public String? UserName { get; set; }
        public String? Role { get; set; }

        public String? Name { get; set; }

        public String? Email { get; set; }

        public Boolean? Permissions { get; set; }
    }
}
