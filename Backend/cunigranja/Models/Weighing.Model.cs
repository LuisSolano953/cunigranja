using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class WeighingModel
    {
        [Key]
<<<<<<< HEAD

        public int Id_weighing { get; set; } = 0;
=======
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [Range(0, 100, ErrorMessage = "El campo {0} debe estar entre {1} y {2}.")]
        public int Id_weighing { get; set; }
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4

        [DataType(DataType.Date)]
        [Display(Name = "Fecha del pesaje")]
        [Required(ErrorMessage = "La fecha de mortalidad es obligatoria.")]
        public DateTime fecha_weighing { get; set; }

        [DisplayName("peso actual")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [StringLength(250, ErrorMessage = "El campo {0} no puede tener más de {1} caracteres.")]
        public string peso_actual { get; set; }

        [DisplayName("peso ganado")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [StringLength(250, ErrorMessage = "El campo {0} no puede tener más de {1} caracteres.")]
        public string ganancia_peso { get; set; }
    }
}
