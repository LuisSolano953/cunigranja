using cunigranja.Models;

namespace cunigranja.Services
{
    public class WeighingServices
    {
        private readonly AppDbContext _context;
        public WeighingServices(AppDbContext context)
        {
            _context = context;
        }
        public IEnumerable<WeighingModel> GetWeighing()
        {
            return _context.weighing.ToList();
        }
        public void Add(WeighingModel entity)
        {
            _context.weighing.Add(entity);
            _context.SaveChanges();
        }
        public bool DeleteById(int Id_weighing)
        {
            var weighing = _context.weighing.Find(Id_weighing);
            if (weighing != null)
            {
                _context.weighing.Remove(weighing);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
        public FoodModel GetWeighingById(int Id_food)
        {
            return _context.food.Find(Id_food);
        }

        public void UpdateWeighing(int Id, WeighingModel updatedWeighing)
        {
            // Traer el usuario existente utilizando el ID
            var weighing = _context.weighing.SingleOrDefault(u => u.Id_weighing == Id);

            if (weighing != null)
            {
                // Actualizar solo los campos que tienen valores en updatedUser
                _context.Entry(weighing).CurrentValues.SetValues(updatedWeighing);
                _context.SaveChanges();
            }
        }

        public IEnumerable<WeighingModel> GetCageInRange(int startId, int endId)
        {
            return _context.weighing
                           .Where(u => u.Id_weighing >= startId && u.Id_weighing <= endId)
                           .ToList();
        }

    }
}
