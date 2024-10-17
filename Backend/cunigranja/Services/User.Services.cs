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

        public void UpdateUser(int Id, User updatedUser)
        {
            // Traer el usuario existente utilizando el ID
            var user = _context.user.SingleOrDefault(u => u.Id_user == Id);

            if (user != null)
            {
                // Actualizar solo los campos que tienen valores en updatedUser
                _context.Entry(user).CurrentValues.SetValues(updatedUser);
                _context.SaveChanges();
            }
        }
        public IEnumerable<User> GetUsersInRange(int startId, int endId)
        {
            return _context.user
                           .Where(u => u.Id_user >= startId && u.Id_user <= endId)
                           .ToList();
        }

    }
}
