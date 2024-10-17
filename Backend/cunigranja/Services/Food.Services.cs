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
          public bool DeleteById(int Id_food)
        {
            var food = _context.food.Find(Id_food);
            if (food != null)
            {
                _context.food.Remove(food);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
        public FoodModel GetFoodById(int Id_food)
        {
            return _context.food.Find(Id_food);
        }

        public void UpdateFood(int Id, FoodModel updatedFood)
        {
            // Traer el usuario existente utilizando el ID
            var food = _context.food.SingleOrDefault(u => u.Id_food == Id);

            if (food != null)
            {
                // Actualizar solo los campos que tienen valores en updatedUser
                _context.Entry(food).CurrentValues.SetValues(updatedFood);
                _context.SaveChanges();
            }
        }

        public IEnumerable<FoodModel> GetCageInRange(int startId, int endId)
        {
            return _context.food
                           .Where(u => u.Id_food >= startId && u.Id_food <= endId)
                           .ToList();
        }

    }
}
