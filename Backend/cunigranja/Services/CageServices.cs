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

        public void Update(CageModel entity)
        {
            var cage = _context.cage.Find(entity.Id_cage);
            if (cage != null)
            {
                cage.capacidad_cage = entity.capacidad_cage;
                cage.tamaño_cage = entity.tamaño_cage;
                cage.ubicacion_cage = entity.ubicacion_cage;
                cage.ficha_conejo = entity.ficha_conejo;
                cage.sexo_conejo = entity.sexo_conejo;
                cage.fecha_ingreso = entity.fecha_ingreso;
                cage.fecha_salida = entity.fecha_salida;
                cage.raza_conejo = entity.raza_conejo;
                cage.estado_cage = entity.estado_cage;
                cage.edad_conejo = entity.edad_conejo;
              
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
    }
}
