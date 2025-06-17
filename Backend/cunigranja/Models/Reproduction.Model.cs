using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        public int total_conejos { get; set; }

        public int nacidos_vivos { get; set; }

        
        public int nacidos_muertos { get; set; }
        public int Id_rabbit { get; set; }
        [ForeignKey("Id_rabbit")]

        public RabbitModel? rabbitmodel { get; set; }
    }
}
