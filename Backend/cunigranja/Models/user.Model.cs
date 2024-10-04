

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
        public int Id_user { get; set; }
        public string password_user { get; set; }
        public string name_user { get; set; }
    }
}   
