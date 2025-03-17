using System.ComponentModel.DataAnnotations;

namespace cunigranja.DTOs
{
    public class MortalityDTO
    {
        public int Id_mortality { get; set; } = 0;

        public int cantidad_mortality { get; set; }

        [DataType(DataType.Date)]
    
        public DateTime fecha_mortality { get; set; }

        public string nombre_rabi {  get; set; }
        public string name_user { get; set; }
    }
}
