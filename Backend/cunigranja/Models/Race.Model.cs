using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace cunigranja.Models
{
    public class RaceModel
    {
        [Key]

        public int Id_race { get; set; } = 0;

        [DisplayName("Raza del Conejo")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [StringLength(250, ErrorMessage = "El campo {0} no puede tener más de {1} caracteres.")]
        public string nombre_race { get; set; }
    }
}
