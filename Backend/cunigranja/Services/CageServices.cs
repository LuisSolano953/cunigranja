using cunigranja.Models;

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
        public void Add(CageModel entity)
        {
            _context.cage.Add(entity);
            _context.SaveChanges();
        }
    }
}
