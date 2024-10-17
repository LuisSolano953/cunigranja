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

        public void UpdateResponsible(int Id, ResponsibleModel updatedResponsible)
        {
            // Traer el usuario existente utilizando el ID
            var responsible = _context.responsible.SingleOrDefault(u => u.Id_responsible == Id);

            if (responsible != null)
            {
                // Actualizar solo los campos que tienen valores en updatedUser
                _context.Entry(responsible).CurrentValues.SetValues(updatedResponsible);
                _context.SaveChanges();
            }
        }
        public IEnumerable<ResponsibleModel> GetResponsibleModelInRange(int startId, int endId)
        {
            return _context.responsible
                           .Where(u => u.Id_responsible >= startId && u.Id_responsible <= endId)
                           .ToList();
        }
    }
    }


