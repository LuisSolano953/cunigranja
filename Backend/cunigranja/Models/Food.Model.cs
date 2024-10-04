using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class FoodModel
    { 


        [Key]
    public int Id_food { get; set; } 
        public string  name_food { get; set; }
        public string cantidad_food { get; set; }
        public DateTime fecha_food { get; set; }
        public DateTime hora_food { get; set; }

    }
}
