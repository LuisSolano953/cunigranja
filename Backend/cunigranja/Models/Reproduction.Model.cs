using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class ReproductionModel
    {
        [Key]
        public int Id_reproduction { get; set; }
        public DateTime fecha_reproduction { get; set; }
    }
}
