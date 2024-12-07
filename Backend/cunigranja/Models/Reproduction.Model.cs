using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class ReproductionModel
    {
        [Key]

<<<<<<< HEAD
        public int Id_reproduction { get; set; } = 0;
=======
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [Range(0, 100, ErrorMessage = "El campo {0} debe estar entre {1} y {2}.")]
        public int Id_reproduction { get; set; }
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4

        [DisplayName("Fecha de reproduccion")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [DataType(DataType.Date)]
        public DateTime fecha_reproduction { get; set; }
    }
}
