using cunigranja.Models;

namespace cunigranja.Services
{
    public class ResponsibleServices
    {
        private readonly AppDbContext _context;
        public ResponsibleServices(AppDbContext context)
        {
            _context = context;
        }
        public IEnumerable<ResponsibleModel> GetUsers()
        {
            return _context.responsible.ToList();
        }
        public void Add(ResponsibleModel entity)
        {
            _context.responsible.Add(entity);
            _context.SaveChanges();
        }
    }

}
