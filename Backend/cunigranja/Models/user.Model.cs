using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class LoginUser
    {

        public string Email { get; set; }

        public string Password { get; set; }
    }

    public class ResetPassUser
    {
        public string Email { get; set; }
    }

    public class TokenRequest
    {
        public string Token { get; set; }
    }

    public class ResetPasswordModel
    {
        public string Token { get; set; }
        public string NewPassword { get; set; }
    }
    // NUEVA CLASE PARA NOTIFICACIONES DE NUEVAS CUENTAS
    public class NewAccountNotificationRequest
    {
        public string AdminEmail { get; set; } = string.Empty;
        public string NewUserName { get; set; } = string.Empty;
        public string NewUserEmail { get; set; } = string.Empty;
        public string UserType { get; set; } = string.Empty;
    }
    public class User
    {
        [Key]
        public int Id_user { get; set; } = 0;

        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(250, ErrorMessage = "el campo {0} tiene un limite de caracteres de {1}")]
        public string password_user { get; set; } //VARCHAR 250

        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(250, ErrorMessage = "el campo {0} tiene un limite de caracteres de {1}")]
        public string name_user { get; set; } //VARCHAR 250

        public string? tipo_user { get; set; } //VARCHAR 250

        public string? token_user { get; set; } //VARCHAR 250

        public int? blockard { get; set; } = 0;


        // Agregar estos campos a tu clase User en Models/User.cs
        public string? ResetToken { get; set; } = null;
        public DateTime? ResetTokenExpiration { get; set; } = null;

        public int? intentos_user { get; set; } //VARCHAR 250

        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(250, ErrorMessage = "el campo {0} tiene un limite de caracteres de {1}")]
        public string email_user { get; set; } //VARCHAR 250
        public string estado { get; set; }//VARCHAR 250

        public string? salt { get; set; }
    }
}
