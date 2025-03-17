using System.ComponentModel.DataAnnotations;

namespace cunigranja.DTOs
{
    public class WeighingDTO
    {
        public int Id_weighing { get; set; } = 0;

        [DataType(DataType.Date)]
        public DateTime fecha_weighing { get; set; }
        public int cantidad_peso { get; set; }

        public string nombre_rabi { get; set; }
        public string name_user { get; set; }
    }
}
