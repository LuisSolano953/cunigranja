using cunigranja.Functions;
using cunigranja.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;

namespace cunigranja.Services
{
    public class FeedingServices
    {
        private readonly AppDbContext _context;
        private readonly FoodServices _foodServices;
        public GeneralFunctions FunctionsGeneral;

        public FeedingServices(AppDbContext context, FoodServices foodServices, IConfiguration configuration = null)
        {
            _context = context;
            _foodServices = foodServices;
            if (configuration != null)
            {
                FunctionsGeneral = new GeneralFunctions(configuration);
            }
        }

        public IEnumerable<FeedingModel> GetAll()
        {
            var feedings = _context.feeding
                .Include(f => f.foodmodel)
                .Include(f => f.user)
                .Include(f => f.rabbitmodel)
                .ToList();

            // Redondear existencia_actual a 1 decimal para la visualización
            foreach (var feeding in feedings)
            {
                feeding.existencia_actual = Math.Round(feeding.existencia_actual, 1);
            }

            return feedings;
        }

        public FeedingModel GetFeedingById(int id)
        {
            var feeding = _context.feeding
                .Include(f => f.foodmodel)
                .Include(f => f.user)
                .Include(f => f.rabbitmodel)
                .FirstOrDefault(c => c.Id_feeding == id);

            if (feeding != null)
            {
                // Redondear existencia_actual a 1 decimal para la visualización
                feeding.existencia_actual = Math.Round(feeding.existencia_actual, 1);

                // NO recalcular la existencia_actual aquí, ya que debe mostrar el valor guardado
                // que representa el saldo después de esta alimentación específica

                if (FunctionsGeneral != null)
                {
                    FunctionsGeneral.AddLog($"GetFeedingById: ID={id}, Alimento ID={feeding.Id_food}, Existencia actual={feeding.existencia_actual}");
                }
            }
            return feeding;
        }
        public void Add(FeedingModel entity)
        {
            try
            {
                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        // Validar que el alimento exista
                        var food = _foodServices.GetFoodById(entity.Id_food);
                        if (food == null)
                        {
                            throw new Exception($"El alimento con ID {entity.Id_food} no existe.");
                        }

                        // Validar que el alimento no esté inactivo
                        if (food.estado_food == "Inactivo")
                        {
                            throw new Exception("El alimento está inactivo y no puede ser utilizado.");
                        }

                        // Convertir la cantidad de alimentación de gramos a kilogramos
                        double cantidadAlimentacionKg = _foodServices.GramosAKilogramos(entity.cantidad_feeding);

                        // Redondear a 2 decimales para los cálculos internos
                        cantidadAlimentacionKg = Math.Round(cantidadAlimentacionKg, 2);

                        // Validar que haya suficiente alimento
                        if (food.saldo_existente < cantidadAlimentacionKg)
                        {
                            throw new Exception($"No hay suficiente alimento. Saldo disponible: {Math.Round(food.saldo_existente, 1)} kg");
                        }

                        // Calcular el nuevo saldo en kilogramos y redondear a 2 decimales para cálculos internos
                        double nuevoSaldoKg = Math.Round(food.saldo_existente - cantidadAlimentacionKg, 2);

                        // IMPORTANTE: Actualizar la existencia actual en la entidad de alimentación
                        // Debe ser el saldo DESPUÉS de restar esta alimentación
                        entity.existencia_actual = Math.Round(nuevoSaldoKg, 1);

                        if (FunctionsGeneral != null)
                        {
                            FunctionsGeneral.AddLog($"Add: Alimento ID={entity.Id_food}, Saldo anterior={food.saldo_existente}, Cantidad={cantidadAlimentacionKg}, Nuevo saldo={nuevoSaldoKg}, Existencia actual={entity.existencia_actual}");
                        }

                        // Registrar la alimentación
                        _context.feeding.Add(entity);
                        _context.SaveChanges();

                        // Actualizar el saldo del alimento
                        food.saldo_existente = nuevoSaldoKg;
                        _foodServices.UpdateFoodState(food);
                        _context.SaveChanges();

                        transaction.Commit();
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        throw ex;
                    }
                }
            }
            catch (Exception ex)
            {
                if (FunctionsGeneral != null)
                {
                    FunctionsGeneral.AddLog($"Error en FeedingServices.Add: {ex.Message}");
                    if (ex.InnerException != null)
                    {
                        FunctionsGeneral.AddLog($"Inner Exception: {ex.InnerException.Message}");
                    }
                }
                throw; // Re-lanzar la excepción para que el controlador la maneje
            }
        }

        public void UpdateFeeding(int Id, FeedingModel updatedFeeding)
        {
            try
            {
                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        // Obtener la alimentación original
                        var feeding = _context.feeding.SingleOrDefault(u => u.Id_feeding == Id);
                        if (feeding == null)
                        {
                            throw new Exception("La alimentación no existe.");
                        }

                        // Verificar que el ID del alimento no haya cambiado
                        // Si ha cambiado, necesitamos actualizar ambos alimentos
                        int originalFoodId = feeding.Id_food;
                        int newFoodId = updatedFeeding.Id_food;

                        // Obtener el alimento original
                        var originalFood = _foodServices.GetFoodById(originalFoodId);
                        if (originalFood == null)
                        {
                            throw new Exception($"El alimento original con ID {originalFoodId} no existe.");
                        }

                        // Obtener el nuevo alimento (si es diferente)
                        var newFood = originalFoodId == newFoodId ? originalFood : _foodServices.GetFoodById(newFoodId);
                        if (newFood == null)
                        {
                            throw new Exception($"El nuevo alimento con ID {newFoodId} no existe.");
                        }

                        // Validar que el alimento no esté inactivo (a menos que sea el mismo registro)
                        if (newFood.estado_food == "Inactivo" && originalFoodId != newFoodId)
                        {
                            throw new Exception("El alimento está inactivo y no puede ser utilizado.");
                        }

                        // Convertir las cantidades de alimentación de gramos a kilogramos
                        double cantidadOriginalKg = _foodServices.GramosAKilogramos(feeding.cantidad_feeding);
                        double nuevaCantidadKg = _foodServices.GramosAKilogramos(updatedFeeding.cantidad_feeding);

                        // Redondear a 2 decimales para cálculos internos
                        cantidadOriginalKg = Math.Round(cantidadOriginalKg, 2);
                        nuevaCantidadKg = Math.Round(nuevaCantidadKg, 2);

                        if (FunctionsGeneral != null)
                        {
                            FunctionsGeneral.AddLog($"UpdateFeeding: ID={Id}, Alimento original ID={originalFoodId}, Nuevo alimento ID={newFoodId}, Cantidad original={cantidadOriginalKg}, Nueva cantidad={nuevaCantidadKg}");
                        }

                        // Si el alimento ha cambiado, necesitamos actualizar ambos alimentos
                        if (originalFoodId != newFoodId)
                        {
                            // 1. Devolver la cantidad original al alimento original
                            double nuevoSaldoOriginal = Math.Round(originalFood.saldo_existente + cantidadOriginalKg, 2);

                            // 2. Restar la nueva cantidad del nuevo alimento
                            if (newFood.saldo_existente < nuevaCantidadKg)
                            {
                                throw new Exception($"No hay suficiente alimento. Saldo disponible: {Math.Round(newFood.saldo_existente, 1)} kg");
                            }

                            double nuevoSaldoNuevo = Math.Round(newFood.saldo_existente - nuevaCantidadKg, 2);

                            if (FunctionsGeneral != null)
                            {
                                FunctionsGeneral.AddLog($"UpdateFeeding: Alimento original ID={originalFoodId} nuevo saldo={nuevoSaldoOriginal}, Nuevo alimento ID={newFoodId} nuevo saldo={nuevoSaldoNuevo}");
                            }

                            // Actualizar la alimentación
                            updatedFeeding.existencia_actual = Math.Round(nuevoSaldoNuevo, 1);
                            _context.Entry(feeding).CurrentValues.SetValues(updatedFeeding);
                            _context.SaveChanges();

                            // Actualizar ambos alimentos
                            originalFood.saldo_existente = nuevoSaldoOriginal;
                            _foodServices.UpdateFoodState(originalFood);
                            _context.SaveChanges();

                            newFood.saldo_existente = nuevoSaldoNuevo;
                            _foodServices.UpdateFoodState(newFood);
                            _context.SaveChanges();

                            // Recalcular ambos alimentos
                            _foodServices.RecalculateFoodBalance(originalFoodId, nuevoSaldoOriginal);
                            _foodServices.RecalculateFoodBalance(newFoodId, nuevoSaldoNuevo);
                        }
                        else
                        {
                            // El alimento no ha cambiado, solo la cantidad
                            // Calcular la diferencia de cantidad en kilogramos
                            double diferenciaKg = nuevaCantidadKg - cantidadOriginalKg;
                            diferenciaKg = Math.Round(diferenciaKg, 2);

                            // Si la cantidad aumenta, verificar si hay suficiente alimento
                            if (diferenciaKg > 0 && newFood.saldo_existente < diferenciaKg)
                            {
                                throw new Exception($"No hay suficiente alimento. Saldo disponible: {Math.Round(newFood.saldo_existente, 1)} kg");
                            }

                            // Calcular el nuevo saldo en kilogramos
                            double nuevoSaldoKg = Math.Round(newFood.saldo_existente - diferenciaKg, 2);

                            if (FunctionsGeneral != null)
                            {
                                FunctionsGeneral.AddLog($"UpdateFeeding: Mismo alimento ID={newFoodId}, Diferencia={diferenciaKg}, Nuevo saldo={nuevoSaldoKg}");
                            }

                            // Actualizar la alimentación
                            updatedFeeding.existencia_actual = Math.Round(nuevoSaldoKg, 1);
                            _context.Entry(feeding).CurrentValues.SetValues(updatedFeeding);
                            _context.SaveChanges();

                            // Actualizar el saldo existente en la tabla de alimentos
                            newFood.saldo_existente = nuevoSaldoKg;
                            _foodServices.UpdateFoodState(newFood);
                            _context.SaveChanges();

                            // Recalcular todos los registros de alimentación relacionados
                            _foodServices.RecalculateFoodBalance(newFoodId, nuevoSaldoKg);
                        }

                        transaction.Commit();
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        throw ex;
                    }
                }
            }
            catch (Exception ex)
            {
                if (FunctionsGeneral != null)
                {
                    FunctionsGeneral.AddLog($"Error en FeedingServices.UpdateFeeding: {ex.Message}");
                    if (ex.InnerException != null)
                    {
                        FunctionsGeneral.AddLog($"Inner Exception: {ex.InnerException.Message}");
                    }
                }
                throw;
            }
        }

        public bool DeleteById(int Id)
        {
            try
            {
                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        var feeding = _context.feeding.Find(Id);
                        if (feeding != null)
                        {
                            // Obtener el alimento para actualizar su saldo
                            var food = _foodServices.GetFoodById(feeding.Id_food);
                            if (food != null)
                            {
                                // Convertir la cantidad de alimentación de gramos a kilogramos
                                double cantidadKg = _foodServices.GramosAKilogramos(feeding.cantidad_feeding);

                                // Redondear a 2 decimales para cálculos internos
                                cantidadKg = Math.Round(cantidadKg, 2);

                                // Devolver la cantidad de alimentación al saldo existente y redondear
                                double nuevoSaldo = Math.Round(food.saldo_existente + cantidadKg, 2);

                                if (FunctionsGeneral != null)
                                {
                                    FunctionsGeneral.AddLog($"DeleteById: ID={Id}, Alimento ID={feeding.Id_food}, Cantidad devuelta={cantidadKg}, Nuevo saldo={nuevoSaldo}");
                                }

                                // Guardar el ID del alimento y el nuevo saldo para recalcular después de eliminar
                                int foodId = food.Id_food;

                                // Eliminar el registro de alimentación
                                _context.feeding.Remove(feeding);
                                _context.SaveChanges();

                                // Actualizar el saldo del alimento
                                food.saldo_existente = nuevoSaldo;
                                _foodServices.UpdateFoodState(food);
                                _context.SaveChanges();

                                // Recalcular todos los registros de alimentación relacionados
                                _foodServices.RecalculateFoodBalance(foodId, nuevoSaldo);

                                transaction.Commit();
                                return true;
                            }

                            _context.feeding.Remove(feeding);
                            _context.SaveChanges();
                            transaction.Commit();
                            return true;
                        }
                        return false;
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        throw ex;
                    }
                }
            }
            catch (Exception ex)
            {
                if (FunctionsGeneral != null)
                {
                    FunctionsGeneral.AddLog($"Error en FeedingServices.DeleteById: {ex.Message}");
                    if (ex.InnerException != null)
                    {
                        FunctionsGeneral.AddLog($"Inner Exception: {ex.InnerException.Message}");
                    }
                }
                throw;
            }
        }

        public IEnumerable<FeedingModel> GetFeedingInRange(int startId, int endId)
        {
            var feedings = _context.feeding
                         .Where(u => u.Id_feeding >= startId && u.Id_feeding <= endId)
                         .ToList();

            // Redondear existencia_actual a 1 decimal para la visualización
            foreach (var feeding in feedings)
            {
                feeding.existencia_actual = Math.Round(feeding.existencia_actual, 1);
            }

            return feedings;
        }
    }
}