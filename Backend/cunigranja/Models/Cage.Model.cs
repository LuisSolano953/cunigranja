using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class CageModel
    {
        [Key]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [Range(0, 100, ErrorMessage = "El campo {0} debe estar entre {1} y {2}.")]
        public int Id_cage { get; set; }

        [DisplayName("Capacidad de la jaula ")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [StringLength(250, ErrorMessage = "El campo {0} no puede tener más de {1} caracteres.")]
        public string capacidad_cage { get; set; }

        [DisplayName("Tamaño de la jaula")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [StringLength(250, ErrorMessage = "El campo {0} no puede tener más de {1} caracteres.")]
        public string tamaño_cage { get; set; }

        [DisplayName("Ubicación de la jaula ")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [StringLength(250, ErrorMessage = "El campo {0} no puede tener más de {1} caracteres.")]
        public string ubicacion_cage { get; set; }

        [DisplayName("Ficha del Conejo")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        public int ficha_conejo { get; set; }

        [DisplayName("Sexo del Conejo")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [StringLength(250, ErrorMessage = "El campo {0} no puede tener más de {1} caracteres.")]
        public string sexo_conejo { get; set; }

        [DisplayName("Fecha de ingreso")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [DataType(DataType.Date)]
        public DateTime fecha_ingreso { get; set; }

        [DisplayName("Fecha de salida ")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [DataType(DataType.Date)]
        public DateTime fecha_salida { get; set; }

        

        [DisplayName("Estado de la Jaula")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [StringLength(250, ErrorMessage = "El campo {0} no puede tener más de {1} caracteres.")]
        public string estado_cage { get; set; }

        [DisplayName("Edad del conejo")]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [Range(0, 20, ErrorMessage = "La edad del conejo debe estar entre {1} y {2}.")]
        public int edad_conejo { get; set; }
    }
}