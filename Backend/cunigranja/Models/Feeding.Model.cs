using cunigranja.Controllers;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cunigranja.Models
{
    
    public class FeedingModel
    {
        [Key]

        public int Id_feeding { get; set; } = 0;

        [DataType(DataType.Date)]
        [Display(Name = "Fecha de la alimentacion")]
        [Required(ErrorMessage = "La fecha de mortalidad es obligatoria.")]
        public DateTime fecha_feeding { get; set; }

        [DataType("hora")]
        [StringLength(250, ErrorMessage = "El campo {0} no puede tener más de {1} caracteres.")]
        [Required(ErrorMessage = "La fecha de mortalidad es obligatoria.")]
        public  string hora_feeding { get; set; }

  
        public  int cantidad_feeding { get; set; }
        public  double existencia_actual { get; set; }

        public int Id_food { get; set; }
        [ForeignKey("Id_food")]

        public FoodModel? foodmodel { get; set; }
        public int Id_user { get; set; }
        [ForeignKey("Id_user")]

        public User? user { get; set; }

        public int Id_rabbit { get; set; }
        [ForeignKey("Id_rabbit")]

        public RabbitModel? rabbitmodel { get; set; }


    }
}
