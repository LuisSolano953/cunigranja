using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class EntradaModel
    {
        [Key]
        public int Id_entrada { get; set; } = 0;

        [DisplayName("Fecha de entrada")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [DataType(DataType.Date)]
        public DateTime fecha_entrada { get; set; }

        [Required(ErrorMessage = "El campo [0] es obligatorio.")]
        [StringLength(250, ErrorMessage = "La Unidad no puede tener más de 50 caracteres.")]
        [Display(Name = "cantidad de")]
        public int cantidad_entrada { get; set; }

        

        [Range(1, 1000000, ErrorMessage = "el valor debe ser mayor que 0.")]
        [Display(Name = "Valor de la entrada ")]
        public int valor_entrada { get; set; }


    }
}
