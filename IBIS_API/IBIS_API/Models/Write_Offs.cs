using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Write_Offs
    {
        [Key]

        public int Write_Off_Id { get; set; }

        public string? item_name{ get; set;}
        public string? Quantity_Written_Off { get; set; }
        public string? Reason { get; set; }
        public char? Image { get; set; }

        public string? base64 { get; set; }  
        


    }
}
