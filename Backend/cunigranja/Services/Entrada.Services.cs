using cunigranja.Models;

namespace cunigranja.Services
{
    public class EntradaServices
    {
        private readonly AppDbContext _context;
        public EntradaServices(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<EntradaModel> GetEntrada()
        {
            return _context.entrada.ToList();
        }

        public EntradaModel GetEntradaById(int id)
        {
            return _context.entrada.FirstOrDefault(c => c.Id_entrada == id);
        }

        public void Add(EntradaModel entity)
        {
            _context.entrada.Add(entity);
            _context.SaveChanges();
        }

        public void UpdateEntrada(int Id, EntradaModel updatedEntrada)
        {
            // Traer el usuario existente utilizando el ID
            var entrada = _context.entrada.SingleOrDefault(u => u.Id_entrada == Id);

            if (entrada != null)
            {
                // Actualizar solo los campos que tienen valores en updatedUser
                _context.Entry(entrada).CurrentValues.SetValues(updatedEntrada);
                _context.SaveChanges();
            }
        }

        public void Delete(int id)
        {
            var entrada = _context.entrada.FirstOrDefault(c => c.Id_entrada == id);
            if (entrada != null)
            {
                _context.entrada.Remove(entrada);
                _context.SaveChanges();
            }
        }
        public IEnumerable<EntradaModel> GetEntradaInRange(int startId, int endId)
        {
            return _context.entrada
                           .Where(u => u.Id_entrada >= startId && u.Id_entrada <= endId)
                           .ToList();
        }
    }
}
