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

        public void Update(FoodModel entity)
        {
            var food = _context.food.Find(entity.Id_food);
            if (food != null)
            {
               food. name_food = entity.name_food; // Actualiza los campos 
               food.cantidad_food = entity.cantidad_food; // Actualiza los campos 
               food.fecha_food = entity.fecha_food; // Actualiza los campos 
               food.hora_food = entity.hora_food; // Actualiza los campos 
                       


                _context.SaveChanges();
            }
        }

    }
}
