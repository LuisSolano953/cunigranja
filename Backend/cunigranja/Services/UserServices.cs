using cunigranja.Models;
using System;

namespace cunigranja.Services
{
    public class UserServices
    {
        private readonly AppDbContext _context;
        public UserServices(AppDbContext context)
        {
            _context = context;
        }
        public IEnumerable<UsersModel> GetUsers()
        {
            return _context.user.ToList();
        }
        
    }
}