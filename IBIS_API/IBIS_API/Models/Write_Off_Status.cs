using System.ComponentModel.DataAnnotations;

namespace IBIS_API.Models
{
    public class Write_Off_Status
    {
        [Key]

        public int Write_Off_Status_ID { get; set; }
	public Boolean? written_off { get; set; }




    }
}
