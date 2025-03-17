using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cunigranja.Models
{
    public class HealthModel
    {
        [Key]

        public int Id_health { get; set; } = 0;

        [Required(ErrorMessage = "El campo Nombre de {0} es obligatorio.")]
        [StringLength(250, ErrorMessage = "El Nombre de Salud no puede tener más de 45 caracteres.")]
        [Display(Name = "Nombre de Salud")]
        public string name_health { get; set; }

        [DisplayName("Fecha de la sanidad")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [DataType(DataType.Date)]
        public DateTime fecha_health { get; set; }

        [Required(ErrorMessage = "El campo {0} de Registro es obligatorio.")]
        [Display(Name = "descripcion de la sanidad")]
        public string descripcion_health { get; set; }


        [Range(1, int.MaxValue, ErrorMessage = "valor de la sanidad mator que 0.")]
        [Display(Name = "Valor de la sanidad")]
        public int valor_health { get; set; }

        public int Id_user { get; set; }
        [ForeignKey("Id_user")]

        public User? user { get; set; }
    }
}