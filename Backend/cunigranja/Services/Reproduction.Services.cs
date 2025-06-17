using cunigranja.Models;
using Microsoft.EntityFrameworkCore;

namespace cunigranja.Services
{
    public class ReproductionServices
    {

        private readonly AppDbContext _context;
        public ReproductionServices(AppDbContext context)
        {
            _context = context;
        }
        public IEnumerable<ReproductionModel> GetAll()
        {
            return _context.reproduction.Include(e => e.rabbitmodel).ToList();
        }
        public void Add(ReproductionModel entity)
        {
            _context.reproduction.Add(entity);
            _context.SaveChanges();
        }
        public bool DeleteById(int Id)
        {
            var reproduction = _context.reproduction.Find(Id);
            if (reproduction!= null)
            {
                _context.reproduction.Remove(reproduction);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
        public ReproductionModel GetReproductionById(int Id_reproduction)
        {
            return _context.reproduction.Find(Id_reproduction);
        }

        public void UpdateReproduction(int Id, ReproductionModel updatedReproduction)
        {
            // Traer el usuario existente utilizando el ID
            var reproduction = _context.reproduction.SingleOrDefault(u => u.Id_reproduction == Id);

            if (reproduction != null)
            {
                // Actualizar solo los campos que tienen valores en updatedUser
                _context.Entry(reproduction).CurrentValues.SetValues(updatedReproduction);
                _context.SaveChanges();
            }
        }
        public IEnumerable<ReproductionModel> GetReproductionInRange(int startId, int endId)
        {
            return _context.reproduction
                           .Where(u => u.Id_reproduction >= startId && u.Id_reproduction <= endId)
                           .ToList();
        }

    }

}
