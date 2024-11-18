using cunigranja.Models;
using System.Collections.Generic;
using System.Linq;

namespace cunigranja.Services
{
    public class CageServices
    {
        private readonly AppDbContext _context;
        public CageServices(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<CageModel> GetCage()
        {
            return _context.cage.ToList();
        }

        public CageModel GetCageById(int id)
        {
            return _context.cage.FirstOrDefault(c => c.Id_cage == id);
        }

        public void Add(CageModel entity)
        {
            _context.cage.Add(entity);
            _context.SaveChanges();
        }

        public void UpdateCage(int Id, CageModel updatedCage)
        {
            // Traer el usuario existente utilizando el ID
            var cage = _context.cage.SingleOrDefault(u => u.Id_cage == Id);

            if (cage != null)
            {
                // Actualizar solo los campos que tienen valores en updatedUser
                _context.Entry(cage).CurrentValues.SetValues(updatedCage);
                _context.SaveChanges();
            }
        }

        public void Delete(int id)
        {
            var cage = _context.cage.FirstOrDefault(c => c.Id_cage == id);
            if (cage != null)
            {
                _context.cage.Remove(cage);
                _context.SaveChanges();
            }
        }
        public IEnumerable<CageModel> GetCageInRange(int startId, int endId)
        {
            return _context.cage
                           .Where(u => u.Id_cage >= startId && u.Id_cage <= endId)
                           .ToList();
        }
    }
}
