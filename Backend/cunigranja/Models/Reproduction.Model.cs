using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class ReproductionModel
    {
        [Key]
        public int Id_Reproduction { get; set; }
        public DateTime fecha__reproduction { get; set; }
    }
}
