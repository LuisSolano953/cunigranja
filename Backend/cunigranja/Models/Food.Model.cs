using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class FoodModel
    {
        [Key]


        public int Id_food { get; set; } = 0;

        [Required(ErrorMessage = "El campo [0] de es obligatorio.")]
        [StringLength(250, ErrorMessage = "El Nombre de Comida no puede tener más de 100 caracteres.")]
        [Display(Name = "Nombre de Comida")]
        public string name_food { get; set; }

        [Required(ErrorMessage = "El campo [0] es obligatorio.")]
        [StringLength(250, ErrorMessage = "La Unidad no puede tener más de 50 caracteres.")]
        [Display(Name = "Unidad de medida de Comida")]
        public string unidad_food { get; set; }

        [Required(ErrorMessage = "El campo [0] de es obligatorio.")]
        [StringLength(250, ErrorMessage = "El estado del alimento puede tener 50 caracteres.")]
        [Display(Name = "Estado de Comida")]
        public string estado_food { get; set; }

        [Range(1, 1000000, ErrorMessage = "el valor debe ser mayor que 0.")]
        [Display(Name = "Valor del alimento")]
        public int valor_food { get; set; }

    }
}