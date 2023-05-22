using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class User_Account_Type
    {
        [Key]

        public int User_Account_Type_ID { get; set; }
	public string? Type { get; set; }


    }
}
