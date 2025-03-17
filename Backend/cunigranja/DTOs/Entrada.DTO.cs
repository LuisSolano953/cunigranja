using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace cunigranja.DTOs
{
    public class EntradaDTO
    {
        public int Id_entrada { get; set; } = 0;

     
        [DataType(DataType.Date)]
        public DateTime fecha_entrada { get; set; }

        public int cantidad_entrada { get; set; }

        public int valor_entrada { get; set; }

        public string cantidad_feeding { get; set; }
    }
}
