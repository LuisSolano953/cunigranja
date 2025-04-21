using cunigranja.Functions;
using cunigranja.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace cunigranja.Services
{
    public class FoodServices
    {
        private readonly AppDbContext _context;
        private readonly IServiceProvider _serviceProvider;
        public GeneralFunctions FunctionsGeneral;

        public FoodServices(AppDbContext context, IServiceProvider serviceProvider, IConfiguration configuration = null)
        {
            _context = context;
            _serviceProvider = serviceProvider;
            if (configuration != null)
            {
                FunctionsGeneral = new GeneralFunctions(configuration);
            }
        }

        public IEnumerable<FoodModel> GetFood()
        {
            // Asegurarse de que todos los saldos se muestren con 2 decimales
            var foods = _context.food.ToList();
            foreach (var food in foods)
            {
                food.saldo_existente = Math.Round(food.saldo_existente, 2);
            }
            return foods;
        }

        public void Add(FoodModel entity)
        {
            // Asegurarse de que la unidad_food siempre sea "kg"
            if (string.IsNullOrEmpty(entity.unidad_food))
            {
                entity.unidad_food = "kg";
            }

            // Redondear el saldo existente a 2 decimales
            entity.saldo_existente = Math.Round(entity.saldo_existente, 2);

            // Actualizar automáticamente el estado según el saldo
            UpdateFoodState(entity);

            _context.food.Add(entity);
            _context.SaveChanges();
        }

        public bool DeleteById(int Id_food)
        {
            var food = _context.food.Find(Id_food);
            if (food != null)
            {
                _context.food.Remove(food);
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        public FoodModel GetFoodById(int Id_food)
        {
            var food = _context.food.Find(Id_food);
            if (food != null)
            {
                // Redondear el saldo existente a 2 decimales
                food.saldo_existente = Math.Round(food.saldo_existente, 2);
            }
            return food;
        }

        public void UpdateFood(int Id, FoodModel updatedFood)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var food = _context.food.SingleOrDefault(u => u.Id_food == Id);

                    if (food != null)
                    {
                        // Guardar el saldo anterior para posible recálculo
                        double oldSaldo = food.saldo_existente;

                        // Redondear el saldo existente a 2 decimales
                        updatedFood.saldo_existente = Math.Round(updatedFood.saldo_existente, 2);

                        // No permitir activar manualmente un alimento si su saldo es 0
                        if (updatedFood.saldo_existente <= 0 && updatedFood.estado_food != "Inactivo")
                        {
                            updatedFood.estado_food = "Inactivo";
                        }

                        // Actualizar automáticamente el estado según el saldo
                        UpdateFoodState(updatedFood);

                        _context.Entry(food).CurrentValues.SetValues(updatedFood);
                        _context.SaveChanges();

                        // Si el saldo ha cambiado, recalcular todos los registros relacionados
                        if (Math.Abs(oldSaldo - updatedFood.saldo_existente) > 0.001)
                        {
                            RecalculateFoodBalance(Id, updatedFood.saldo_existente);
                        }

                        transaction.Commit();
                    }
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    if (FunctionsGeneral != null)
                    {
                        FunctionsGeneral.AddLog($"Error en UpdateFood: {ex.Message}");
                    }
                    throw;
                }
            }
        }

        public IEnumerable<FoodModel> GetCageInRange(int startId, int endId)
        {
            var foods = _context.food
                         .Where(u => u.Id_food >= startId && u.Id_food <= endId)
                         .ToList();

            // Redondear todos los saldos a 2 decimales
            foreach (var food in foods)
            {
                food.saldo_existente = Math.Round(food.saldo_existente, 2);
            }

            return foods;
        }

        // Método auxiliar para actualizar el estado del alimento según el saldo
        public void UpdateFoodState(FoodModel food)
        {
            if (food.saldo_existente <= 0)
            {
                food.estado_food = "Inactivo"; // Cuando el saldo es 0, el estado es Inactivo
            }
            else if (food.saldo_existente <= 5)
            {
                food.estado_food = "Casi por acabar";
            }
            else
            {
                food.estado_food = "Existente";
            }
        }

        // Método para validar la coherencia entre saldo y estado
        public bool ValidateFoodState(FoodModel food)
        {
            if ((food.estado_food == "Existente" || food.estado_food == "Casi por acabar") && food.saldo_existente <= 0)
            {
                return false;
            }

            if (food.estado_food == "Inactivo" && food.saldo_existente > 0)
            {
                return false;
            }

            return true;
        }

        // Método para obtener cuántos kilogramos hay en un bulto
        public int KilosPorBulto()
        {
            // Por defecto, un bulto tiene 40kg
            return 40;
        }

        // Método para convertir bultos a kilogramos
        public int BultosAKilogramos(int bultos)
        {
            return bultos * KilosPorBulto();
        }

        // Método para convertir gramos a kilogramos
        public double GramosAKilogramos(int gramos)
        {
            // Convertir y redondear a 2 decimales
            return Math.Round(gramos / 1000.0, 2);
        }

        // Método mejorado para recalcular saldos cuando cambia el saldo de un alimento
        public void RecalculateFoodBalance(int foodId, double newSaldo)
        {
            try
            {
                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        // Obtener el alimento
                        var food = _context.food.Find(foodId);
                        if (food == null)
                        {
                            throw new Exception($"Alimento con ID {foodId} no encontrado");
                        }

                        // Guardar el saldo anterior para logging
                        double oldSaldo = food.saldo_existente;

                        // Registrar la operación si está disponible el servicio de logging
                        if (FunctionsGeneral != null)
                        {
                            FunctionsGeneral.AddLog($"RecalculateFoodBalance: Alimento ID {foodId}, saldo anterior: {oldSaldo}, nuevo saldo: {newSaldo}");
                        }

                        // Asegurarse de que el saldo esté redondeado a 2 decimales para cálculos internos
                        newSaldo = Math.Round(newSaldo, 2);

                        // Actualizar el saldo del alimento
                        food.saldo_existente = newSaldo;

                        // Actualizar el estado según el nuevo saldo
                        UpdateFoodState(food);

                        // Guardar los cambios en la tabla de alimentos
                        _context.SaveChanges();

                        // 1. ACTUALIZAR TABLA DE ENTRADAS
                        // Obtener la entrada más reciente para este alimento
                        var latestEntry = _context.entrada
                            .Where(e => e.Id_food == foodId)
                            .OrderByDescending(e => e.fecha_entrada)
                            .FirstOrDefault();

                        if (latestEntry != null)
                        {
                            // Actualizar la existencia actual en la entrada más reciente
                            latestEntry.existencia_actual = (int)Math.Round(newSaldo);
                            _context.SaveChanges();

                            // Registrar la actualización
                            if (FunctionsGeneral != null)
                            {
                                FunctionsGeneral.AddLog($"RecalculateFoodBalance: Actualizada existencia actual en entrada ID {latestEntry.Id_entrada} a {latestEntry.existencia_actual}");
                            }
                        }

                        // 2. ACTUALIZAR TABLA DE ALIMENTACIÓN
                        // Obtener TODOS los registros de alimentación que usan este alimento específico por ID
                        var feedingRecords = _context.feeding
                            .Where(f => f.Id_food == foodId)
                            .OrderByDescending(f => f.fecha_feeding)
                            .ThenByDescending(f => f.hora_feeding)
                            .ToList();

                        if (feedingRecords.Any())
                        {
                            // Registrar para depuración
                            if (FunctionsGeneral != null)
                            {
                                FunctionsGeneral.AddLog($"RecalculateFoodBalance: Encontrados {feedingRecords.Count} registros de alimentación para alimento ID {foodId}");
                            }

                            // Calcular el saldo final después de aplicar todas las alimentaciones
                            double saldoFinal = newSaldo;

                            // Actualizar el registro más reciente con el nuevo saldo exacto
                            var latestFeeding = feedingRecords.First();

                            // Restar la cantidad de alimentación del registro más reciente
                            double cantidadKg = GramosAKilogramos(latestFeeding.cantidad_feeding);
                            saldoFinal = Math.Round(newSaldo - cantidadKg, 2);

                            // La existencia actual en alimentación debe ser el saldo después de restar esta alimentación
                            latestFeeding.existencia_actual = Math.Round(saldoFinal, 1);

                            if (FunctionsGeneral != null)
                            {
                                FunctionsGeneral.AddLog($"RecalculateFoodBalance: Registro más reciente (ID {latestFeeding.Id_feeding}) actualizado a {latestFeeding.existencia_actual}");
                            }

                            // Recalcular todos los registros anteriores en cascada
                            double runningBalance = saldoFinal;

                            for (int i = 1; i < feedingRecords.Count; i++)
                            {
                                // Para cada registro anterior, sumar la cantidad del registro actual
                                // (porque estamos yendo hacia atrás en el tiempo)
                                double cantidadActualKg = GramosAKilogramos(feedingRecords[i].cantidad_feeding);
                                runningBalance = Math.Round(runningBalance + cantidadActualKg, 2);

                                // Redondear a 1 decimal para visualización
                                feedingRecords[i].existencia_actual = Math.Round(runningBalance, 1);

                                if (FunctionsGeneral != null && i % 10 == 0) // Loggear cada 10 registros para no saturar
                                {
                                    FunctionsGeneral.AddLog($"RecalculateFoodBalance: Registro ID {feedingRecords[i].Id_feeding} actualizado a {feedingRecords[i].existencia_actual}");
                                }
                            }

                            // Guardar todos los cambios en la tabla de alimentación
                            _context.SaveChanges();

                            // Actualizar el saldo del alimento con el saldo final después de todas las alimentaciones
                            food.saldo_existente = saldoFinal;
                            UpdateFoodState(food);
                            _context.SaveChanges();

                            // Registrar la actualización
                            if (FunctionsGeneral != null)
                            {
                                FunctionsGeneral.AddLog($"RecalculateFoodBalance: Actualizados {feedingRecords.Count} registros de alimentación para alimento ID {foodId}");
                                FunctionsGeneral.AddLog($"RecalculateFoodBalance: Saldo final del alimento actualizado a {saldoFinal}");
                            }
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
                // Registrar el error si está disponible el servicio de logging
                if (FunctionsGeneral != null)
                {
                    FunctionsGeneral.AddLog($"Error en RecalculateFoodBalance: {ex.Message}");
                    if (ex.InnerException != null)
                    {
                        FunctionsGeneral.AddLog($"Inner Exception: {ex.InnerException.Message}");
                    }
                }
                throw; // Re-lanzar la excepción para que el controlador la maneje
            }
        }
    }
}