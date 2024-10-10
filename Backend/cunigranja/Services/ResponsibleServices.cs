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
        public IEnumerable<ResponsibleModel> GetResponsible()
        {
            return _context.responsible.ToList();
        }
        public void Add(ResponsibleModel entity)
        {
            _context.responsible.Add(entity);
            _context.SaveChanges();
        }
        public bool DeleteById(int Id_responsible)
        {
            var responsible = _context.responsible.Find(Id_responsible);
            if (responsible != null)
            {
                _context.responsible.Remove(responsible);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
        public ResponsibleModel GetResponsibleById(int Id_responsible)
        {
            return _context.responsible.Find(Id_responsible);
        }

        public void Update(ResponsibleModel entity)
        {
            var responsible = _context.responsible.Find(entity.Id_responsible);
            if (responsible != null)
            {
                responsible.name_responsible = entity.name_responsible; // Actualiza los campos 
                responsible.tipo_responsible = entity.tipo_responsible; // Actualiza los campos 
              

                _context.SaveChanges();
            }
        }
    }

}
