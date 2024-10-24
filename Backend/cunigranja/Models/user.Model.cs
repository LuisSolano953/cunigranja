

using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class LoginUser
    {
      
        public string Email{ get; set; }

        public string Passaword { get; set; }
    }
    public class ResetPassUser
    {
        public string Email { get; set; }
    }
    public class User
    {
        [Key]
        [Required(ErrorMessage = "El campo {0} es obligatorio.")]
        [Range(0, 100, ErrorMessage = "El campo {0} debe estar entre {1} y {2}.")]
        public int Id_user { get; set; }

        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(250, ErrorMessage = "el campo {0} tiene un limite de caracteres de {1}")]
        public string password_user { get; set; } //VARCHAR 250

        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(250, ErrorMessage = "el campo {0} tiene un limite de caracteres de {1}")]
        public string name_user { get; set; } //VARCHAR 250

        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(250, ErrorMessage = "el campo {0} tiene un limite de caracteres de {1}")]
        public string tipo_user { get; set; } //VARCHAR 250

        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(250, ErrorMessage = "el campo {0} tiene un limite de caracteres de {1}")]
        public string token_user { get; set; } //VARCHAR 250

        public bool blockard { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "La cantidad de intento debe ser mayor que 0.")]
        [Display(Name = "Cantidad de Mortalidad")]
        public string intentos_user {get; set; } //VARCHAR 250

        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(250, ErrorMessage = "el campo {0} tiene un limite de caracteres de {1}")]
        public string email_user {get; set; } //VARCHAR 250

        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(250, ErrorMessage = "el campo {0} tiene un limite de caracteres de {1}")]
        public string salt { get; set; }
    }
}   
 