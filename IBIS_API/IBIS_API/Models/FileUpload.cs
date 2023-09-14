using System.ComponentModel.DataAnnotations;
namespace IBIS_API.Models
{
    public class FileUpload
    {
        [Key]
        public int? FileUpload_ID { get; set; }
        public string? Name { get; set;}

        public string? Base64 { get; set;}


    }
}
