using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cunigranja.Models
{
    public class RabbitModel
    {
        [Key]
        public int Id_rabbit { get; set; } = 0;

        [DisplayName("nombre del Conejo")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [StringLength(250, ErrorMessage = "El campo {0} no puede tener más de {1} caracteres.")]
        public string name_rabbit { get; set; }

        [DisplayName("Fecha de salida")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [DataType(DataType.Date)]
        public DateTime fecha_registro { get; set; }

        [Range(1, 300, ErrorMessage = "el peso actual debe ser mayor que 0.")]
        [Display(Name = "peso actual de conejo")]
        public int peso_actual { get; set; }

        [Range(1, 300, ErrorMessage = "el peso inicial del conejo debe ser mayor que 0.")]
        [Display(Name = "peso inicial del conejo")]
        public int peso_inicial { get; set; }

        [DisplayName("sexo del Conejo")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [StringLength(250, ErrorMessage = "El campo {0} no puede tener más de {1} caracteres.")]
        public string sexo_rabbit { get; set; }

        [DisplayName("estado del Conejo")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [StringLength(250, ErrorMessage = "El campo {0} no puede tener más de {1} caracteres.")]
        public string estado { get; set; }

        public int Id_cage { get; set; }

        [ForeignKey("Id_cage")]
        public CageModel? cagemodel { get; set; }

        public int Id_race { get; set; }

        [ForeignKey("Id_race")]
        public RaceModel? racemodel { get; set; }
    }
}
