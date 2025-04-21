using cunigranja.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace cunigranja.Services
{
    public class WeighingServices
    {
        private readonly AppDbContext _context;
        private readonly IServiceProvider _serviceProvider;

        public WeighingServices(AppDbContext context, IServiceProvider serviceProvider)
        {
            _context = context;
            _serviceProvider = serviceProvider;
        }

        public IEnumerable<WeighingModel> GetAll()
        {
            return _context.weighing
                .Include(w => w.rabbitmodel)
                .Include(w => w.user)
                .ToList();
        }

        public WeighingModel GetWeighingById(int id)
        {
            return _context.weighing
                .Include(w => w.rabbitmodel)
                .Include(w => w.user)
                .FirstOrDefault(w => w.Id_weighing == id);
        }

        // Método para obtener pesajes por ID de conejo
        public IEnumerable<WeighingModel> GetWeighingByRabbitId(int rabbitId)
        {
            return _context.weighing
                .Where(w => w.Id_rabbit == rabbitId)
                .OrderBy(w => w.fecha_weighing)
                .ToList();
        }

        public void Add(WeighingModel entity)
        {
            _context.weighing.Add(entity);
            _context.SaveChanges();

            // Después de agregar un nuevo pesaje, actualizar el peso actual del conejo
            UpdateRabbitCurrentWeight(entity.Id_rabbit, entity.ganancia_peso);
        }

        public void UpdateWeighing(int id, WeighingModel updatedWeighing)
        {
            var weighing = _context.weighing.SingleOrDefault(w => w.Id_weighing == id);
            if (weighing != null)
            {
                // Guardar la ganancia de peso anterior
                int oldGananciaPeso = weighing.ganancia_peso;

                // Actualizar el registro de pesaje
                _context.Entry(weighing).CurrentValues.SetValues(updatedWeighing);
                _context.SaveChanges();

                // Si la ganancia de peso cambió, actualizar el peso actual del conejo
                if (oldGananciaPeso != updatedWeighing.ganancia_peso)
                {
                    // Calcular la diferencia en la ganancia de peso
                    int gananciaDiff = updatedWeighing.ganancia_peso - oldGananciaPeso;

                    // Actualizar el peso actual del conejo con la diferencia
                    UpdateRabbitCurrentWeight(updatedWeighing.Id_rabbit, gananciaDiff);
                }
            }
        }

        public bool DeleteById(int id)
        {
            var weighing = _context.weighing.FirstOrDefault(w => w.Id_weighing == id);
            if (weighing != null)
            {
                // Guardar la información antes de eliminar
                int rabbitId = weighing.Id_rabbit;
                int gananciaPeso = weighing.ganancia_peso;

                // Eliminar el registro
                _context.weighing.Remove(weighing);
                _context.SaveChanges();

                // Actualizar el peso actual del conejo restando la ganancia de peso
                UpdateRabbitCurrentWeight(rabbitId, -gananciaPeso);
                return true;
            }
            return false;
        }

        // Método para obtener pesajes en un rango de IDs
        public IEnumerable<WeighingModel> GetCageInRange(int startId, int endId)
        {
            return _context.weighing
                .Where(w => w.Id_weighing >= startId && w.Id_weighing <= endId)
                .ToList();
        }

        // Método para actualizar el peso actual del conejo
        private void UpdateRabbitCurrentWeight(int rabbitId, int gananciaPeso)
        {
            var rabbit = _context.rabbit.FirstOrDefault(r => r.Id_rabbit == rabbitId);
            if (rabbit != null)
            {
                // Actualizar el peso actual sumando la ganancia de peso
                rabbit.peso_actual += gananciaPeso;
                _context.SaveChanges();
            }
        }

        // Método para recalcular el peso actual de un conejo basado en su peso inicial y los pesajes
        public void RecalculateRabbitCurrentWeight(int rabbitId, int newPesoInicial)
        {
            // Obtener el conejo
            var rabbit = _context.rabbit.FirstOrDefault(r => r.Id_rabbit == rabbitId);
            if (rabbit == null) return;

            // Verificar que el peso inicial se haya actualizado correctamente
            if (rabbit.peso_inicial != newPesoInicial)
            {
                rabbit.peso_inicial = newPesoInicial;
                _context.SaveChanges();
            }

            // Obtener todos los pesajes del conejo ordenados por fecha
            var weighings = _context.weighing
                .Where(w => w.Id_rabbit == rabbitId)
                .OrderBy(w => w.fecha_weighing)
                .ToList();

            if (!weighings.Any())
            {
                // Si no hay pesajes, el peso actual es igual al peso inicial
                rabbit.peso_actual = newPesoInicial;
                _context.SaveChanges();
                return;
            }

            // Actualizar la ganancia de peso de cada pesaje basado en el nuevo peso inicial
            foreach (var weighing in weighings)
            {
                // La ganancia de peso es el peso medido menos el peso inicial
                weighing.ganancia_peso = weighing.peso_actual - newPesoInicial;
                _context.Entry(weighing).State = EntityState.Modified;
            }

            // El peso actual del conejo es el peso inicial más la suma de todas las ganancias de peso
            rabbit.peso_actual = newPesoInicial + weighings.Sum(w => w.ganancia_peso);

            _context.SaveChanges();
        }

    }
}
