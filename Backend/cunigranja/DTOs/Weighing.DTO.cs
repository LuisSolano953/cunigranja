using System.ComponentModel.DataAnnotations;

namespace cunigranja.DTOs
{
    public class WeighingDTO
    {
        public int Id_weighing { get; set; } = 0;

        [DataType(DataType.Date)]
        public DateTime fecha_weighing { get; set; }
        public int ganancia_peso { get; set; }
        public int peso_actual { get; set; }
        public string name_rabbit { get; set; }
        public string name_user { get; set; }
        public int Id_rabbit { get; set; }
        public int Id_user { get; set; }
    }
}
