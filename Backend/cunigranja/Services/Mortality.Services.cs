using cunigranja.Models;
using Microsoft.EntityFrameworkCore;

namespace cunigranja.Services
{
    public class MortalityServices
    {
        private readonly AppDbContext _context;

        public MortalityServices(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<MortalityModel> GetAll()
        {
            return _context.mortality.Include(t => t.user).Include(t=>t.rabbitmodel).ToList();
        }

        public MortalityModel GetById(int id)
        {
            return _context.mortality.Find(id);
        }

        public void Add(MortalityModel entity)
        {
            _context.mortality.Add(entity);
            _context.SaveChanges();
        }

        public void UpdateMortality(int Id, MortalityModel updatedMortality)
        {
            // Traer el usuario existente utilizando el ID
            var Mortality = _context.mortality.SingleOrDefault(u => u.Id_mortality == Id);

            if (Mortality != null)
            {
                // Actualizar solo los campos que tienen valores en updatedUser
                _context.Entry(Mortality).CurrentValues.SetValues(updatedMortality);
                _context.SaveChanges();
            }
        }

        public bool DeleteById(int id)
        {
            var Mortality = _context.mortality.Find(id);
            if (Mortality != null)
            {
                _context.mortality.Remove(Mortality);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
        public IEnumerable<MortalityModel> GetMortalityInRange(int startId, int endId)
        {
            return _context.mortality
                           .Where(u => u.Id_mortality >= startId && u.Id_mortality <= endId)
                           .ToList();
        }
    }
}
