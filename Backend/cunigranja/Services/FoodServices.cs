using cunigranja.Models;

namespace cunigranja.Services
{
    public class FoodServices
    {
        private readonly AppDbContext _context;
        public FoodServices(AppDbContext context)
        {
            _context = context;
        }
        public IEnumerable<FoodModel> GetFood()
        {
            return _context.food.ToList();
        }
        public void Add(FoodModel entity)
        {
            _context.food.Add(entity);
            _context.SaveChanges();
        }
    }
}
