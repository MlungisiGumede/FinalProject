using System.ComponentModel.DataAnnotations;
namespace IBIS_API.Models { 
   
    public class Category
    {
    

        [Key]
        public int Category_ID { get; set; }
        public string Name { get; set; }

    }
}
