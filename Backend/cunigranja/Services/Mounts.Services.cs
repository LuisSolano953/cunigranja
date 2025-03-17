using cunigranja.Models;
using Microsoft.EntityFrameworkCore;

namespace cunigranja.Services
{
    public class MountsServices
    {
        private readonly AppDbContext _context;
        public MountsServices(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<MountsModel> GetAll()
        {
            return _context.mounts.Include(m => m.rabimodel).ToList();
        }

        public MountsModel GetMountsById(int id)
        {
            return _context.mounts.FirstOrDefault(c => c.Id_mounts == id);
        }

        public void Add(MountsModel entity)
        {
            _context.mounts.Add(entity);
            _context.SaveChanges();
        }

        public void UpdateMounts(int Id, MountsModel updatedMounts)
        {
            // Traer el usuario existente utilizando el ID
            var mounts = _context.mounts.SingleOrDefault(u => u.Id_mounts == Id);

            if (mounts != null)
            {
                // Actualizar solo los campos que tienen valores en updatedUser
                _context.Entry(mounts).CurrentValues.SetValues(updatedMounts);
                _context.SaveChanges();
            }
        }

        public void Delete(int id)
        {
            var mounts = _context.mounts.FirstOrDefault(c => c.Id_mounts == id);
            if (mounts != null)
            {
                _context.mounts.Remove(mounts);
                _context.SaveChanges();
            }
        }
        public IEnumerable<MountsModel> GetMountsInRange(int startId, int endId)
        {
            return _context.mounts
                           .Where(u => u.Id_mounts >= startId && u.Id_mounts <= endId)
                           .ToList();
        }
    }
}
