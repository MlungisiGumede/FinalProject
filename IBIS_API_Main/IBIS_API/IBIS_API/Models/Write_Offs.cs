using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Write_Offs
    {
        [Key]
        public int Write_Off_ID { get; set; }
    public virtual Product? Product_ID { get; set; }
     
    public virtual Write_Off_Status? Write_Off_Status_ID { get; set; }




    }
}
