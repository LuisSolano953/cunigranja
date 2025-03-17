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

        public string cantidad_feeding { get; set; }

        public string name_food { get; set; }
       
    }
}
    