using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class HealthModel
    {
        [Key]
        public string id_health { get; set; }

        public string date_health { get; set; }

        public string name_health { get; set; }
       
    }
}
