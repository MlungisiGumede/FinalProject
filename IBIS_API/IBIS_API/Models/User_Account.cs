using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
	public class User_Account
    {
        [Key]

       // public int User_Account_ID { get; set; }
	public string? Username { get; set; }
	public string? Password { get; set; }
	 public string? FullName { get; set; }
	 public string? Email { get; set; }
		public double? time { get; set; }
	public string? Cellphone_Number { get; set; }

        public string? ClientUrl { get; set; }

        public string? token { get; set; }
        //public virtual User_Account_Type? User_Account_Type_ID { get; set; }








    }
}
