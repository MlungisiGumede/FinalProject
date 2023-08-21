using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
	public class User_Account
    {
        [Key]

        public int User_Account_ID { get; set; }
	public string? Username { get; set; }
	public string? Password { get; set; }
	 public string? Name { get; set; }
	 public string? Surname { get; set; }
	 public string? Address { get; set; }
	public string? Cellphone_Number { get; set; }
	//public virtual User_Account_Type? User_Account_Type_ID { get; set; }








    }
}
