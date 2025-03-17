using System.ComponentModel.DataAnnotations;

namespace cunigranja.DTOs
{
    public class MountsDTO
    {
        public int Id_mounts { get; set; } = 0;


        [DataType(DataType.Date)]
        public DateTime tiempo_mounts { get; set; }

        [DataType(DataType.Date)]
        public DateTime fecha_mounts { get; set; }
        public int cantidad_mounts { get; set; }

        public string nombre_rabi { get; set; }
    }
}
