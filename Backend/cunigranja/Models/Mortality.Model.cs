using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class MortalityModel
    {
        [Key]
        public int Id_mortality { get; set; }
        public string causa_mortality { get; set; }
        public int cantidad_mortality { get; set; }
        public DateTime fecha_mortality { get; set; }

    }
}
