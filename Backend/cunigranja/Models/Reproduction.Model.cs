using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class ReproductionModel
    {
        [Key]

        public int Id_reproduction { get; set; } = 0;

        [DisplayName("Fecha de reproduccion")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [DataType(DataType.Date)]
        public DateTime fecha_reproduction { get; set; }
    }
}
