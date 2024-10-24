using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class FeedingModel
    {
        [Key]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [Range(0, 100, ErrorMessage = "El campo {0} debe estar entre {1} y {2}.")]
        public  int Id_feeding { get; set; }

        [DataType(DataType.Date)]
        [Display(Name = "Fecha de la alimentacion")]
        [Required(ErrorMessage = "La fecha de mortalidad es obligatoria.")]
        public DateTime fecha_feeding { get; set; }

        [DataType(DataType.Date)]
        [Display(Name = "Hora de la alimentacion")]
        [Required(ErrorMessage = "La fecha de mortalidad es obligatoria.")]
        public  DateTime hora_feeding { get; set; }

        [DisplayName("Cantidad de alimentacion")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [StringLength(250, ErrorMessage = "El campo {0} no puede tener más de {1} caracteres.")]
        public  string cantidad_feeding { get; set; }
    }
}
