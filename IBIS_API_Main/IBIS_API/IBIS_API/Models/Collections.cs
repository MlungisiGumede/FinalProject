using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    
    public class Collection
    {
        [Key]
    public int Collections_ID  {get; set; }
        public Boolean collected { get; set; }
   // public virtual Customer? Customer_ID { get; set; }

   // public virtual Order? Order_ID { get; set; }
     //public virtual Collection_Status? Collection_Status_ID { get; set; }

    }
}
