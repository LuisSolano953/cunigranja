using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace cunigranja.Models
{
    public class RaceModel
    {
        [Key]
<<<<<<< HEAD

        public int Id_race { get; set; } = 0;
=======
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [Range(0, 100, ErrorMessage = "El campo {0} debe estar entre {1} y {2}.")]
        public int Id_race { get; set; }
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4

        [DisplayName("Raza del Conejo")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [StringLength(250, ErrorMessage = "El campo {0} no puede tener más de {1} caracteres.")]
        public string nombre_race { get; set; }
    }
}
