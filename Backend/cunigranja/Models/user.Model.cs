

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
        public int Num { get; set;  }
        public string Name { get; set; }
    }
}   
