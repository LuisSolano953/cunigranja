using cunigranja.Models;

namespace cunigranja.Services
{
    public class ReproductionServices
    {

        private readonly AppDbContext _context;
        public ReproductionServices(AppDbContext context)
        {
            _context = context;
        }
        public IEnumerable<ReproductionModel> GetUsers()
        {
            return _context.reproduction.ToList();
        }
        public void Add(ReproductionModel entity)
        {
            _context.reproduction.Add(entity);
            _context.SaveChanges();
        }

    }

}
