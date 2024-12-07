using cunigranja.Models;

namespace cunigranja.Services
{
    public class RabiServices
    {
        private readonly AppDbContext _context;
        public RabiServices(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<RabiModel> GetRabi()
        {
            return _context.rabi.ToList();
        }

        public RabiModel GetRabiById(int id)
        {
            return _context.rabi.FirstOrDefault(c => c.Id_rabi == id);
        }

        public void Add(RabiModel entity)
        {
            _context.rabi.Add(entity);
            _context.SaveChanges();
        }

        public void UpdateRabi(int Id, RabiModel updatedRabi)
        {
            // Traer el usuario existente utilizando el ID
            var rabi = _context.rabi.SingleOrDefault(u => u.Id_rabi == Id);

            if (rabi != null)
            {
                // Actualizar solo los campos que tienen valores en updatedUser
                _context.Entry(rabi).CurrentValues.SetValues(updatedRabi);
                _context.SaveChanges();
            }
        }

        public void Delete(int id)
        {
            var rabi = _context.rabi.FirstOrDefault(c => c.Id_rabi == id);
            if (rabi != null)
            {
                _context.rabi.Remove(rabi);
                _context.SaveChanges();
            }
        }
        public IEnumerable<RabiModel> GetRabiInRange(int startId, int endId)
        {
            return _context.rabi
                           .Where(u => u.Id_rabi >= startId && u.Id_rabi <= endId)
                           .ToList();
        }
    }
}
