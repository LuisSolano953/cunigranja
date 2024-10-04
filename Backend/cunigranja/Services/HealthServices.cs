using cunigranja.Models;
using Microsoft.EntityFrameworkCore;

namespace cunigranja.Services
{ 
     public class HealthServices
     {
        private readonly AppDbContext _context;
        public HealthServices(AppDbContext context)
        {
            _context = context;
        }
        public IEnumerable<HealthModel> GetHealth()
        {
            return _context.health.ToList();
        }
        public void Add(HealthModel entity)
        {
            _context.health.Add(entity);
            _context.SaveChanges();
        }
     }
}

