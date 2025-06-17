using cunigranja.Models;
using System;
using System.Diagnostics;

namespace cunigranja.Services
{
    public class RaceServices
    {
        private readonly AppDbContext _context;
        public RaceServices(AppDbContext context)
        {
            _context = context;
        }

        // Obtener todas las razas
        public IEnumerable<RaceModel> GetRace()
        {
            return _context.race.ToList();
        }

        // Agregar una nueva raza
        public void Add(RaceModel entity)
        {
            _context.race.Add(entity);
            _context.SaveChanges();
        }

        // Eliminar una raza por su ID
        public bool DeleteById(int Id_race)
        {
            var race = _context.race.Find(Id_race);
            if (race != null)
            {
                _context.race.Remove(race);
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        // Obtener una raza por su ID
        public RaceModel GetRaceById(int Id_race)
        {
            return _context.race.Find(Id_race);
        }

        // Actualizar una raza existente
        public void UpdateRace(int Id, RaceModel updatedRace)
        {
            // Traer la raza existente utilizando el ID
            var race = _context.race.SingleOrDefault(r => r.Id_race == Id);

            if (race != null)
            {
                // Actualizar solo los campos que tienen valores en updatedRace
                _context.Entry(race).CurrentValues.SetValues(updatedRace);
                _context.SaveChanges();
            }
        }

        // Obtener razas dentro de un rango de IDs
        public IEnumerable<RaceModel> GetRaceInRange(int startId, int endId)
        {
            return _context.race
                           .Where(r => r.Id_race >= startId && r.Id_race <= endId)
                           .ToList();
        }
    }
}
