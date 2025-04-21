using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace cunigranja.Models
{
    public class DesteteModel
    {
        [Key]

        public int Id_destete { get; set; } = 0;

        [DataType(DataType.Date)]
        [Display(Name = "Fecha de la alimentacion")]
        [Required(ErrorMessage = "La fecha de mortalidad es obligatoria.")]
        public DateTime fecha_destete { get; set; }

        [Range(1, 300, ErrorMessage = "el peso debe de ser mayor que 0.")]
        [Display(Name = "peso del destete")]
        public int peso_destete { get; set; }

        public int Id_rabbit { get; set; }
        [ForeignKey("Id_rabbit")]

        public RabbitModel? rabbitmodel { get; set; }

    }
}
