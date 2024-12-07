using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class WeighingModel
    {
        [Key]

        public int Id_weighing { get; set; } = 0;

        [DataType(DataType.Date)]
        [Display(Name = "Fecha del pesaje")]
        [Required(ErrorMessage = "La fecha de mortalidad es obligatoria.")]
        public DateTime fecha_weighing { get; set; }


        [Range(1, 500, ErrorMessage = "La cantidad de peso debe ser mayor que 0.")]
        [Display(Name = "Cantidad de peso")]
        public int cantidad_peso { get; set; }
    }
}
