using cunigranja.Models;
using Microsoft.EntityFrameworkCore;

namespace cunigranja.Services
{
    public class UserServices
    {
        private readonly AppDbContext _context;
        public UserServices(AppDbContext context)
        {
            _context = context;
        }
        public IEnumerable<User> GetUsers()
        {
            return _context.user.ToList();
        }
        public void Add(User entity)
        {
            _context.user.Add(entity);
            _context.SaveChanges();
        }
        public bool DeleteById(int Id_user)
        {
            var user = _context.user.Find(Id_user);
            if (user != null)
            {
                _context.user.Remove(user);
                _context.SaveChanges();
                return true; 
            }
            return false; 
        }
        public User GetUserById(int Id_user)
        {
            return _context.user.Find(Id_user);
        }

        public void Update(User entity)
        {
            var user = _context.user.Find(entity.Id_user); 
            if (user != null)
            {
                user.name_user = entity.name_user; // Actualiza los campos 
                user.password_user = entity.password_user;
               

                _context.SaveChanges();
            }
        }
    }
}
