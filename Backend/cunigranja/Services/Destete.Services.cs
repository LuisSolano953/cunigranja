using cunigranja.Models;
using Microsoft.EntityFrameworkCore;

namespace cunigranja.Services
{
    public class DesteteServices
    {
        private readonly AppDbContext _context;
        public DesteteServices(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<DesteteModel> GetAll()
        {
            return _context.destete.Include(d => d.rabimodel).ToList();
        }

        public DesteteModel GetDesteteById(int id)
        {
            return _context.destete.FirstOrDefault(c => c.Id_destete == id);
        }

        public void Add(DesteteModel entity)
        {
            _context.destete.Add(entity);
            _context.SaveChanges();
        }

        public void UpdateDestete(int Id, DesteteModel updatedDestete)
        {
            // Traer el usuario existente utilizando el ID
            var destete = _context.destete.SingleOrDefault(u => u.Id_destete == Id);

            if (destete != null)
            {
                // Actualizar solo los campos que tienen valores en updatedUser
                _context.Entry(destete).CurrentValues.SetValues(updatedDestete);
                _context.SaveChanges();
            }
        }

        public void Delete(int id)
        {
            var destete = _context.destete.FirstOrDefault(c => c.Id_destete == id);
            if (destete != null)
            {
                _context.destete.Remove(destete);
                _context.SaveChanges();
            }
        }
        public IEnumerable<DesteteModel> GetDesteteInRange(int startId, int endId)
        {
            return _context.destete
                           .Where(u => u.Id_destete >= startId && u.Id_destete <= endId)
                           .ToList();
        }
    }
}
