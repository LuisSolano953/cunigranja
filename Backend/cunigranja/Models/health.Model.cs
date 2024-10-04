using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class HealthModel
    {
        [Key]
        public int id_health { get; set; }

        public string name_health { get; set; }
       
        public DateTime fecha_health { get; set; }

    }
}
