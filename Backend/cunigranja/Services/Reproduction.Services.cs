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
        public IEnumerable<ReproductionModel> GetReproduction()
        {
            return _context.reproduction.ToList();
        }
        public void Add(ReproductionModel entity)
        {
            _context.reproduction.Add(entity);
            _context.SaveChanges();
        }
        public bool DeleteById(int Id_reproduction)
        {
            var reproduction = _context.reproduction.Find(Id_reproduction);
            if (reproduction!= null)
            {
                _context.reproduction.Remove(reproduction);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
        public ReproductionModel GetReproductionById(int Id_reproduction)
        {
            return _context.reproduction.Find(Id_reproduction);
        }

        public void Update(ReproductionModel entity)
        {
            var reproduction = _context.reproduction.Find(entity.Id_reproduction);
            if (reproduction != null)
            {
                reproduction.fecha_reproduction = entity.fecha_reproduction; // Actualiza los campos 
              


                _context.SaveChanges();
            }
        }

    }

}
