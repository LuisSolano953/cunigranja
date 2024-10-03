using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class UsersModel
    {
        [Key]
        public int Id_user { get; set; }
        public string password_user { get; set; }
        public string name_user { get; set; }
    }
}