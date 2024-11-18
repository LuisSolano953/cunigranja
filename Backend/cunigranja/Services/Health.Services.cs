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

        public void UpdateHealth(int Id, HealthModel updatedHealth)
        {
            // Traer el usuario existente utilizando el ID
            var health = _context.health.SingleOrDefault(u => u.Id_health == Id);

            if (health != null)
            {
                // Actualizar solo los campos que tienen valores en updatedUser
                _context.Entry(health).CurrentValues.SetValues(updatedHealth);
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
        public IEnumerable<HealthModel> GetCageInRange(int startId, int endId)
        {
            return _context.health
                           .Where(u => u.Id_health >= startId && u.Id_health <= endId)
                           .ToList();
        }
    }
}
