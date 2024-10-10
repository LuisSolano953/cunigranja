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

        public HealthModel GetHealthById(int id)
        {
            return _context.health.Find(id);
        }

        public void Add(HealthModel entity)
        {
            _context.health.Add(entity);
            _context.SaveChanges();
        }

        public void Update(HealthModel entity)
        {
            var health = _context.health.Find(entity.Id_health);
            if (health != null)
            {
                health.name_health = entity.name_health;
                health.fecha_health = entity.fecha_health;

                _context.SaveChanges();
            }
        }

        public bool DeleteById(int id)
        {
            var health = _context.health.Find(id);
            if (health != null)
            {
                _context.health.Remove(health);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
    }
}
