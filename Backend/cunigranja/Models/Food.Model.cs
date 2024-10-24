using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class FoodModel
    {
        [Key]

        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [Range(0, 100, ErrorMessage = "El campo {0} debe estar entre {1} y {2}.")]
        public int Id_food { get; set; }

        [Required(ErrorMessage = "El campo [0] de es obligatorio.")]
        [StringLength(250, ErrorMessage = "El Nombre de Comida no puede tener m�s de 100 caracteres.")]
        [Display(Name = "Nombre de Comida")]
        public string name_food { get; set; }

        [Required(ErrorMessage = "El campo [0] es obligatorio.")]
        [StringLength(250, ErrorMessage = "La Cantidad no puede tener m�s de 50 caracteres.")]
        [Display(Name = "Cantidad de Comida")]
        public string cantidad_food { get; set; }

    }
}