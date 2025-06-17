using cunigranja.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace cunigranja.DTOs
{
    public class FeedingDTO
    {
        public int Id_feeding { get; set; } = 0;

        [DataType(DataType.Date)]
        public DateTime fecha_feeding { get; set; }

        [DataType("hora")]
        public string hora_feeding { get; set; }

        public int cantidad_feeding { get; set; }
        public double existencia_actual { get; set; }

        public string name_food { get; set; }
        public string name_user { get; set; }
        public string name_rabbit { get; set; }

        // Añadir esta propiedad
        public int Id_food { get; set; }
    }
}