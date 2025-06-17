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
        [Display(Name = "Nombre de Salud")]
        public string name_health { get; set; }

        [DisplayName("Fecha de la sanidad")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [DataType(DataType.Date)]
        public DateTime fecha_health { get; set; }

        [Required(ErrorMessage = "El campo {0} de Registro es obligatorio.")]
        [Display(Name = "descripcion de la sanidad")]
        public string descripcion_health { get; set; }


        
        public int valor_health { get; set; }

        public int Id_user { get; set; }
        [ForeignKey("Id_user")]

        public User? user { get; set; }
    }
}