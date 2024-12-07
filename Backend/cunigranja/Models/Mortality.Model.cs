using System;
using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class MortalityModel
    {
        [Key]

        public int Id_mortality { get; set; } = 0;


        [Range(1,40, ErrorMessage = "La cantidad de mortalidad debe ser mayor que 0.")]
        [Display(Name = "Cantidad de Mortalidad")]
        public int cantidad_mortality { get; set; }

        [DataType(DataType.Date)]
        [Display(Name = "Fecha de Mortalidad")]
        [Required(ErrorMessage = "La fecha de mortalidad es obligatoria.")]
        public DateTime fecha_mortality { get; set; }
    }
}
