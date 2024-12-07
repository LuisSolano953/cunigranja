using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class CageModel
    {
        [Key]

        public int Id_cage { get; set; } = 0;

       

        

        [DisplayName("Estado de la Jaula")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [StringLength(250, ErrorMessage = "El campo {0} no puede tener más de {1} caracteres.")]
        public string estado_cage { get; set; }


    }
}