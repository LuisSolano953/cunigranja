using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cunigranja.Models
{
    public class WeighingModel
    {
        [Key]
        public int Id_weighing { get; set; } = 0;

        [DataType(DataType.Date)]
        [Display(Name = "Fecha del pesaje")]
        [Required(ErrorMessage = "La fecha de pesaje es obligatoria.")]
        public DateTime fecha_weighing { get; set; }

      
        public int peso_actual { get; set; }

       
        public int ganancia_peso { get; set; }

        public int Id_rabbit { get; set; }

        [ForeignKey("Id_rabbit")]
        public RabbitModel? rabbitmodel { get; set; }

        public int Id_user { get; set; }

        [ForeignKey("Id_user")]
        public User? user { get; set; }
    }
}
