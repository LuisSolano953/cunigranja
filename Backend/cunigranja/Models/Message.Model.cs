
using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class Mensaje
    {
        [Key]
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Saludo { get; set; }
    }
}
