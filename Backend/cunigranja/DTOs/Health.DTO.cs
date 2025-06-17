using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace cunigranja.DTOs
{
    public class HealthDTO
    {
        public int Id_health { get; set; } = 0;
        public string name_health { get; set; }
        [DataType(DataType.Date)]
        public DateTime fecha_health { get; set; }
        public string descripcion_health { get; set; }
        public int valor_health { get; set; }
        public string name_user { get; set; }
        public int Id_user { get; set; }
    }
}
