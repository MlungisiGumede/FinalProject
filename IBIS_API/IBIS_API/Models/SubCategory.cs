using System.ComponentModel.DataAnnotations;
namespace IBIS_API.Models   
{
   

    public class SubCategory
    {
    [Key]
        public int? SubCategory_ID { get; set; }

        public string? Name { get; set; }

        public int? Category_ID { get; set; }
    }
}
