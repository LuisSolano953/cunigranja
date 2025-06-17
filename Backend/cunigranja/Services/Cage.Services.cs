using cunigranja.Models;
using System.Collections.Generic;
using System.Linq;

namespace cunigranja.Services
{
    public class CageServices
    {
        private readonly AppDbContext _context;
        public CageServices(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<CageModel> GetCage()
        {
            return _context.cage.ToList();
        }

        public CageModel GetCageById(int id)
        {
            return _context.cage.FirstOrDefault(c => c.Id_cage == id);
        }

        public void Add(CageModel entity)
        {
            _context.cage.Add(entity);
            _context.SaveChanges();
        }

        public void UpdateCage(int Id, CageModel updatedCage)
        {
            // Traer el usuario existente utilizando el ID
            var cage = _context.cage.SingleOrDefault(u => u.Id_cage == Id);

            if (cage != null)
            {
                // Actualizar solo los campos que tienen valores en updatedUser
                _context.Entry(cage).CurrentValues.SetValues(updatedCage);
                _context.SaveChanges();
            }
        }

        public void Delete(int id)
        {
            var cage = _context.cage.FirstOrDefault(c => c.Id_cage == id);
            if (cage != null)
            {
                _context.cage.Remove(cage);
                _context.SaveChanges();
            }
        }

        // Método para verificar la capacidad de una jaula
        public bool CheckCageCapacity(int cageId)
        {
            // Obtener la jaula
            var cage = _context.cage.FirstOrDefault(c => c.Id_cage == cageId);
            if (cage == null) return false;

            // Obtener la cantidad máxima de animales que soporta
            int maxCapacity = cage.cantidad_animales;

            // Contar cuántos conejos están asignados a esta jaula
            int currentOccupancy = _context.rabbit.Count(r => r.Id_cage == cageId);

            // Verificar si hay capacidad disponible
            return currentOccupancy < maxCapacity;
        }

        // Método para obtener la ocupación actual de una jaula
        public int GetCageOccupancy(int cageId)
        {
            return _context.rabbit.Count(r => r.Id_cage == cageId);
        }
        // Añade este método a tu clase CageServices
        public IEnumerable<CageModel> GetCageInRange(int startId, int endId)
        {
            return _context.cage
                           .Where(u => u.Id_cage >= startId && u.Id_cage <= endId)
                           .ToList();
        }
        // Método para obtener la capacidad máxima de una jaula
        public int GetCageCapacity(int cageId)
        {
            var cage = _context.cage.FirstOrDefault(c => c.Id_cage == cageId);
            return cage?.cantidad_animales ?? 0;
        }
    }
}
