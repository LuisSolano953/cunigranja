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
        public DateTime fecha_nacimiento { get; set; }

        [Range(1, 50, ErrorMessage = "La cantidad de Cantidad de conejos nacidos debe ser mayor que 0.")]
        [Display(Name = "Cantidad de conejos nacidos")]
        public int total_conejos { get; set; }

        [Range(1, 30, ErrorMessage = "La cantidad de nacidos vivos debe ser mayor que 0.")]
        [Display(Name = "nacidos vivos")]
        public int nacidos_vivos { get; set; }

        [Range(0, 30, ErrorMessage = "La cantidad de nacidos muertos puede  ser igual omayor que 0.")]
        [Display(Name = "nacidos muertos")]
        public int nacidos_muertos { get; set; }
    }
}
