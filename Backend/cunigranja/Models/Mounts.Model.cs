using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace cunigranja.Models
{
    public class MountsModel
    {
        [Key]

        public int Id_mounts { get; set; } = 0;


        [DataType(DataType.Date)]
        [Display(Name = "tiempo de la monta")]
        [Required(ErrorMessage = "el tiempo de la monta es obligatoria.")]
        public DateTime tiempo_mounts { get; set; }

        [DataType(DataType.Date)]
        [Display(Name = "Fecha de la monta")]
        [Required(ErrorMessage = "La fecha de la  monta es obligatoria.")]
        public DateTime fecha_mounts { get; set; }

        [Range(1, 30, ErrorMessage = "La cantidad de montas debe ser mayor que 0.")]
        [Display(Name = "montas")]
        public int cantidad_mounts { get; set; }

        public int Id_rabi { get; set; }
        [ForeignKey("Id_rabi")]

        public RabiModel rabimodel { get; set; }

    }
}
