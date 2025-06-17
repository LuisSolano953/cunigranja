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
            // Obtener el conejo para calcular correctamente la ganancia de peso
            var rabbit = _context.rabbit.FirstOrDefault(r => r.Id_rabbit == entity.Id_rabbit);
            if (rabbit != null)
            {
                // Calcular la ganancia de peso correctamente como la diferencia entre
                // el peso medido actual y el peso actual del conejo
                entity.ganancia_peso = entity.peso_actual - rabbit.peso_actual;

                // Guardar el registro de pesaje (SIEMPRE se guarda con los datos reales)
                _context.weighing.Add(entity);
                _context.SaveChanges();

                // ✅ SOLO actualizar el peso del conejo si la ganancia es positiva o cero
                if (entity.ganancia_peso >= 0)
                {
                    // Si hay ganancia positiva, actualizar el peso acumulado del conejo
                    rabbit.peso_actual = entity.peso_actual;
                    _context.SaveChanges();
                }
                // ❌ Si la ganancia es negativa, NO actualizar el peso del conejo
                // El peso acumulado se mantiene para preservar el historial de crecimiento
            }
            else
            {
                // Si no se encuentra el conejo, simplemente guardar el registro de pesaje
                _context.weighing.Add(entity);
                _context.SaveChanges();
            }
        }

        public void UpdateWeighing(int id, WeighingModel updatedWeighing)
        {
            var weighing = _context.weighing.SingleOrDefault(w => w.Id_weighing == id);
            if (weighing != null)
            {
                // Guardar la ganancia de peso anterior y el peso actual anterior
                int oldGananciaPeso = weighing.ganancia_peso;
                int oldPesoActual = weighing.peso_actual;

                // Actualizar el registro de pesaje
                _context.Entry(weighing).CurrentValues.SetValues(updatedWeighing);
                _context.SaveChanges();

                // Si el peso actual cambió, recalcular la ganancia y actualizar el conejo
                if (oldPesoActual != updatedWeighing.peso_actual)
                {
                    // Obtener el conejo
                    var rabbit = _context.rabbit.FirstOrDefault(r => r.Id_rabbit == updatedWeighing.Id_rabbit);
                    if (rabbit != null)
                    {
                        // ✅ CAMBIO: No actualizar directamente, recalcular todo
                        // rabbit.peso_actual = updatedWeighing.peso_actual;  // ❌ COMENTADO
                        // _context.SaveChanges();

                        // Recalcular el peso actual basado en la nueva lógica
                        RecalculateRabbitCurrentWeight(updatedWeighing.Id_rabbit);

                        // Recalcular todos los pesajes posteriores
                        RecalculateSubsequentWeighings(updatedWeighing.Id_rabbit, updatedWeighing.Id_weighing);
                    }
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

                // Eliminar el registro
                _context.weighing.Remove(weighing);
                _context.SaveChanges();

                // Recalcular el peso actual del conejo basado en los pesajes restantes
                RecalculateRabbitCurrentWeight(rabbitId);
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
        // Este método ya no se usa directamente, pero lo mantenemos por compatibilidad
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

        // ✅ MÉTODO CORREGIDO - Implementa la lógica de ignorar ganancias negativas
        public void RecalculateRabbitCurrentWeight(int rabbitId, int? newPesoInicial = null)
        {
            // Obtener el conejo
            var rabbit = _context.rabbit.FirstOrDefault(r => r.Id_rabbit == rabbitId);
            if (rabbit == null) return;

            // Actualizar el peso inicial si se proporciona uno nuevo
            if (newPesoInicial.HasValue && rabbit.peso_inicial != newPesoInicial.Value)
            {
                rabbit.peso_inicial = newPesoInicial.Value;
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
                rabbit.peso_actual = rabbit.peso_inicial;
                _context.SaveChanges();
                return;
            }

            // ✅ NUEVA LÓGICA: Calcular peso acumulado ignorando ganancias negativas
            int pesoAnterior = rabbit.peso_inicial;
            int pesoAcumulado = rabbit.peso_inicial; // Empezamos con el peso inicial

            foreach (var weighing in weighings)
            {
                // Calcular ganancia real (puede ser negativa)
                int gananciaReal = weighing.peso_actual - pesoAnterior;

                // Guardar la ganancia real en el registro
                weighing.ganancia_peso = gananciaReal;
                _context.Entry(weighing).State = EntityState.Modified;

                // ✅ CLAVE: Solo sumar ganancias positivas al peso acumulado
                if (gananciaReal > 0)
                {
                    pesoAcumulado += gananciaReal;
                }
                // Si gananciaReal <= 0, NO se suma nada al peso acumulado

                // El peso anterior para el siguiente cálculo es el peso actual del registro
                pesoAnterior = weighing.peso_actual;
            }

            // ✅ CAMBIO PRINCIPAL: El peso actual del conejo es el peso acumulado (no el último pesaje)
            // CÓDIGO ORIGINAL (INCORRECTO):
            // var lastWeighing = weighings.Last();
            // rabbit.peso_actual = lastWeighing.peso_actual;

            // CÓDIGO CORREGIDO:
            rabbit.peso_actual = pesoAcumulado;
            _context.SaveChanges();

            // Recalcular las ganancias de peso para cada pesaje
            // RecalculateWeighingGains(rabbitId);  // ❌ COMENTADO porque ya lo hicimos arriba
        }

        // ✅ MÉTODO CORREGIDO - Implementa la lógica de ignorar ganancias negativas
        private void RecalculateWeighingGains(int rabbitId)
        {
            // Obtener el conejo
            var rabbit = _context.rabbit.FirstOrDefault(r => r.Id_rabbit == rabbitId);
            if (rabbit == null) return;

            // Obtener todos los pesajes del conejo ordenados por fecha
            var weighings = _context.weighing
                .Where(w => w.Id_rabbit == rabbitId)
                .OrderBy(w => w.fecha_weighing)
                .ToList();

            if (!weighings.Any()) return;

            // ✅ NUEVA LÓGICA: Peso acumulado que ignora ganancias negativas
            int pesoAnterior = rabbit.peso_inicial;
            int pesoAcumulado = rabbit.peso_inicial;

            // Para el primer pesaje, la ganancia es respecto al peso inicial
            var firstWeighing = weighings.First();
            firstWeighing.ganancia_peso = firstWeighing.peso_actual - rabbit.peso_inicial;
            _context.Entry(firstWeighing).State = EntityState.Modified;

            // Solo sumar si es ganancia positiva
            if (firstWeighing.ganancia_peso > 0)
            {
                pesoAcumulado += firstWeighing.ganancia_peso;
            }
            pesoAnterior = firstWeighing.peso_actual;

            // Para los demás pesajes, la ganancia es respecto al pesaje anterior
            for (int i = 1; i < weighings.Count; i++)
            {
                var previousWeighing = weighings[i - 1];
                var currentWeighing = weighings[i];

                // Calcular la ganancia como la diferencia entre el peso actual y el peso del pesaje anterior
                currentWeighing.ganancia_peso = currentWeighing.peso_actual - previousWeighing.peso_actual;
                _context.Entry(currentWeighing).State = EntityState.Modified;

                // ✅ Solo sumar ganancias positivas al peso acumulado
                if (currentWeighing.ganancia_peso > 0)
                {
                    pesoAcumulado += currentWeighing.ganancia_peso;
                }

                pesoAnterior = currentWeighing.peso_actual;
            }

            // ✅ Actualizar el peso actual del conejo con el peso acumulado
            rabbit.peso_actual = pesoAcumulado;
            _context.SaveChanges();
        }

        // Método para recalcular los pesajes posteriores a un pesaje modificado
        private void RecalculateSubsequentWeighings(int rabbitId, int modifiedWeighingId)
        {
            // Obtener todos los pesajes del conejo ordenados por fecha
            var allWeighings = _context.weighing
                .Where(w => w.Id_rabbit == rabbitId)
                .OrderBy(w => w.fecha_weighing)
                .ToList();

            // Encontrar el índice del pesaje modificado
            int modifiedIndex = allWeighings.FindIndex(w => w.Id_weighing == modifiedWeighingId);
            if (modifiedIndex < 0) return; // No se encontró el pesaje modificado

            // Si es el primer pesaje, recalcular todo desde el principio
            if (modifiedIndex == 0)
            {
                RecalculateWeighingGains(rabbitId);
                return;
            }

            // ✅ SIMPLIFICADO: Recalcular todo para mantener consistencia con la nueva lógica
            RecalculateWeighingGains(rabbitId);

            // CÓDIGO ORIGINAL COMENTADO (mantenía la lógica incorrecta):
            /*
            // Para los pesajes posteriores al modificado, recalcular las ganancias
            for (int i = modifiedIndex; i < allWeighings.Count; i++)
            {
                var previousWeighing = i > 0 ? allWeighings[i - 1] : null;
                var currentWeighing = allWeighings[i];

                if (previousWeighing != null)
                {
                    // Calcular la ganancia como la diferencia entre el peso actual y el peso del pesaje anterior
                    currentWeighing.ganancia_peso = currentWeighing.peso_actual - previousWeighing.peso_actual;
                    _context.Entry(currentWeighing).State = EntityState.Modified;
                }
            }

            _context.SaveChanges();

            // Actualizar el peso actual del conejo al peso del último pesaje
            if (allWeighings.Any())
            {
                var rabbit = _context.rabbit.FirstOrDefault(r => r.Id_rabbit == rabbitId);
                if (rabbit != null)
                {
                    rabbit.peso_actual = allWeighings.Last().peso_actual;  // ❌ ESTO ERA EL PROBLEMA
                    _context.SaveChanges();
                }
            }
            */
        }
    }
}
