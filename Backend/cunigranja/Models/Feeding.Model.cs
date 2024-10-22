using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class FeedingModel
    {
        [Key]
        public  int Id_feeding { get; set; }
        public DateTime fecha_feeding { get; set; }
        public  DateTime hora_feeding { get; set; }
        public  string cantidad_feeding { get; set; }
    }
}
