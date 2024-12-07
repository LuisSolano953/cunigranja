using System;
using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class MortalityModel
    {
        [Key]
<<<<<<< HEAD

        public int Id_mortality { get; set; } = 0;
=======
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [Range(0, 100, ErrorMessage = "El campo {0} debe estar entre {1} y {2}.")]
        public int Id_mortality { get; set; }
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4

        [Required(ErrorMessage = "La causa de la mortalidad es obligatoria.")]
        [StringLength(250, ErrorMessage = "La causa de la mortalidad no puede tener más de 100 caracteres.")]
        [Display(Name = "Causa de Mortalidad")]
        public string causa_mortality { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "La cantidad de mortalidad debe ser mayor que 0.")]
        [Display(Name = "Cantidad de Mortalidad")]
        public int cantidad_mortality { get; set; }

        [DataType(DataType.Date)]
        [Display(Name = "Fecha de Mortalidad")]
        [Required(ErrorMessage = "La fecha de mortalidad es obligatoria.")]
        public DateTime fecha_mortality { get; set; }
    }
}
