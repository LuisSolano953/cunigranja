using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cunigranja.Models
{
    public class MortalityModel
    {
        [Key]

        public int Id_mortality { get; set; } = 0;

        public string causa_mortality { get; set; }

        [DataType(DataType.Date)]
        [Display(Name = "Fecha de Mortalidad")]
        [Required(ErrorMessage = "La fecha de mortalidad es obligatoria.")]
        public DateTime fecha_mortality { get; set; }

        public int Id_rabbit { get; set; }
        [ForeignKey("Id_rabbit")]

        public RabbitModel? rabbitmodel { get; set; }

        public int Id_user { get; set; }
        [ForeignKey("Id_user")]

        public User? user { get; set; }


    }
}
