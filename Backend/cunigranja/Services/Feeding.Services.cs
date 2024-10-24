using cunigranja.Models;

namespace cunigranja.Services
{
    public class FeedingServices
    {
        private readonly AppDbContext _context;
        public FeedingServices(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<FeedingModel> GetFeeding()
        {
            return _context.feeding.ToList();
        }

        public FeedingModel GetFeedingById(int id)
        {
            return _context.feeding.FirstOrDefault(c => c.Id_feeding == id);
        }

        public void Add(FeedingModel entity)
        {
            _context.feeding.Add(entity);
            _context.SaveChanges();
        }

        public void UpdateFeeding(int Id, FeedingModel updatedFeeding)
        {
            // Traer el usuario existente utilizando el ID
            var feeding = _context.feeding.SingleOrDefault(u => u.Id_feeding == Id);

            if (feeding != null)
            {
                // Actualizar solo los campos que tienen valores en updatedUser
                _context.Entry(feeding).CurrentValues.SetValues(updatedFeeding);
                _context.SaveChanges();
            }
        }

        public void Delete(int id)
        {
            var feeding = _context.feeding.FirstOrDefault(c => c.Id_feeding == id);
            if (feeding != null)
            {
                _context.feeding.Remove(feeding);
                _context.SaveChanges();
            }
        }
        public IEnumerable<FeedingModel> GetFeedingInRange(int startId, int endId)
        {
            return _context.feeding
                           .Where(u => u.Id_feeding >= startId && u.Id_feeding <= endId)
                           .ToList();
        }
    }
}

