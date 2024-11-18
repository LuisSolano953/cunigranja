using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class HealthModel
    {
        [Key]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [Range(0, 100, ErrorMessage = "El campo {0} debe estar entre {1} y {2}.")]
        public int Id_health { get; set; }

        [Required(ErrorMessage = "El campo Nombre de {0} es obligatorio.")]
        [StringLength(250, ErrorMessage = "El Nombre de Salud no puede tener más de 45 caracteres.")]
        [Display(Name = "Nombre de Salud")]
        public string name_health { get; set; }

        [Required(ErrorMessage = "El campo {0} de Registro es obligatorio.")]
        [Display(Name = "Fecha de Registro")]
        public DateTime fecha_health { get; set; }
    }
}