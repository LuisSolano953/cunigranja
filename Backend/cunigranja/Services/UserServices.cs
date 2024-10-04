using cunigranja.Models;

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
        
    }
}