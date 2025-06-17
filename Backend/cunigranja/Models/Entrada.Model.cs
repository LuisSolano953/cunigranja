using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

      
        public int cantidad_entrada { get; set; }

        

        public int valor_entrada { get; set; }

        public int Id_food { get; set; }
        [ForeignKey("Id_food")]

        public FoodModel? foodmodel { get; set; }
        public int existencia_actual { get; set; }
        public int valor_total { get; set; }

    }
}
