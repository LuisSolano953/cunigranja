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
            var foods = _context.food.ToList();
            foreach (var food in foods)
            {
                food.saldo_existente = Math.Round(food.saldo_existente, 2);
            }
            return foods;
        }

        public void Add(FoodModel entity)
        {
            if (string.IsNullOrEmpty(entity.unidad_food))
            {
                entity.unidad_food = "g";
            }

            entity.saldo_existente = Math.Round(entity.saldo_existente, 2);
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
                        double oldSaldo = food.saldo_existente;
                        updatedFood.saldo_existente = Math.Round(updatedFood.saldo_existente, 2);

                        // Solo forzar a Inactivo si el saldo es exactamente 0
                        if (updatedFood.saldo_existente <= 0)
                        {
                            updatedFood.estado_food = "Inactivo";
                        }

                        _context.Entry(food).CurrentValues.SetValues(updatedFood);
                        _context.SaveChanges();

                        // Solo recalcular si el saldo ha cambiado significativamente
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

        // MÉTODO MODIFICADO: Para activar/desactivar con lógica automática
        public bool ToggleFoodStatus(int foodId, string newStatus)
        {
            try
            {
                var food = _context.food.Find(foodId);
                if (food == null)
                {
                    if (FunctionsGeneral != null)
                    {
                        FunctionsGeneral.AddLog($"Alimento con ID {foodId} no encontrado");
                    }
                    return false;
                }

                if (FunctionsGeneral != null)
                {
                    FunctionsGeneral.AddLog($"Cambiando estado de alimento ID {foodId} de '{food.estado_food}' a '{newStatus}'");
                }

                // Si se está activando el alimento (de Inactivo a Existente)
                if (food.estado_food == "Inactivo" && newStatus == "Existente")
                {
                    // Primero ponerlo como Existente
                    food.estado_food = "Existente";

                    // Luego evaluar automáticamente según el saldo
                    UpdateFoodState(food);

                    if (FunctionsGeneral != null)
                    {
                        FunctionsGeneral.AddLog($"Alimento activado. Estado final después de evaluación automática: '{food.estado_food}'");
                    }
                }
                // Si se está desactivando (cualquier estado a Inactivo)
                else if (newStatus == "Inactivo")
                {
                    food.estado_food = "Inactivo";

                    if (FunctionsGeneral != null)
                    {
                        FunctionsGeneral.AddLog($"Alimento desactivado a 'Inactivo'");
                    }
                }
                else
                {
                    // Para cualquier otro cambio, usar el estado solicitado
                    food.estado_food = newStatus;
                }

                _context.SaveChanges();

                if (FunctionsGeneral != null)
                {
                    FunctionsGeneral.AddLog($"Estado final guardado: '{food.estado_food}' para alimento ID {foodId}");
                }

                return true;
            }
            catch (Exception ex)
            {
                if (FunctionsGeneral != null)
                {
                    FunctionsGeneral.AddLog($"Error en ToggleFoodStatus: {ex.Message}");
                }
                throw;
            }
        }

        public IEnumerable<FoodModel> GetCageInRange(int startId, int endId)
        {
            var foods = _context.food
                         .Where(u => u.Id_food >= startId && u.Id_food <= endId)
                         .ToList();

            foreach (var food in foods)
            {
                food.saldo_existente = Math.Round(food.saldo_existente, 2);
            }

            return foods;
        }

        public void UpdateFoodState(FoodModel food)
        {
            if (food.saldo_existente <= 0)
            {
                food.estado_food = "Inactivo";
            }
            else if (food.saldo_existente <= 5000) // 5kg = 5000g
            {
                food.estado_food = "Casi por acabar";
            }
            else
            {
                food.estado_food = "Existente";
            }
        }

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

        public int KilosPorBulto()
        {
            return 40;
        }

        public int BultosAKilogramos(int bultos)
        {
            return bultos * KilosPorBulto() * 1000;
        }

        public double GramosAKilogramos(int gramos)
        {
            return gramos;
        }

        public void RecalculateFoodBalance(int foodId, double newSaldoBase)
        {
            try
            {
                if (FunctionsGeneral != null)
                {
                    FunctionsGeneral.AddLog($"=== INICIO RecalculateFoodBalance ===");
                    FunctionsGeneral.AddLog($"Alimento ID: {foodId}, Nuevo saldo base: {newSaldoBase}");
                }

                var food = _context.food.Find(foodId);
                if (food == null)
                {
                    throw new Exception($"Alimento con ID {foodId} no encontrado");
                }

                newSaldoBase = Math.Round(newSaldoBase, 2);
                food.saldo_existente = newSaldoBase;

                // Evaluar estado automáticamente según el saldo
                UpdateFoodState(food);

                var feedingRecords = _context.feeding
                    .Where(f => f.Id_food == foodId)
                    .OrderBy(f => f.fecha_feeding)
                    .ThenBy(f => f.hora_feeding)
                    .ThenBy(f => f.Id_feeding)
                    .ToList();

                if (FunctionsGeneral != null)
                {
                    FunctionsGeneral.AddLog($"Encontrados {feedingRecords.Count} registros de alimentación");
                }

                if (feedingRecords.Any())
                {
                    double saldoActual = newSaldoBase;

                    foreach (var feeding in feedingRecords)
                    {
                        double cantidadGramos = (double)Math.Round((double)feeding.cantidad_feeding, 2);
                        saldoActual = Math.Round(saldoActual - cantidadGramos, 2);

                        if (saldoActual < 0)
                        {
                            saldoActual = 0;
                        }

                        feeding.existencia_actual = (double)Math.Round(saldoActual, 1);

                        if (FunctionsGeneral != null)
                        {
                            FunctionsGeneral.AddLog($"Registro ID {feeding.Id_feeding}: -{cantidadGramos}g, saldo resultante: {saldoActual}g");
                        }
                    }

                    food.saldo_existente = saldoActual;

                    // Evaluar estado final automáticamente
                    UpdateFoodState(food);

                    if (FunctionsGeneral != null)
                    {
                        FunctionsGeneral.AddLog($"Saldo final del alimento: {saldoActual}g, Estado final: {food.estado_food}");
                    }
                }

                var latestEntry = _context.entrada
                    .Where(e => e.Id_food == foodId)
                    .OrderByDescending(e => e.fecha_entrada)
                    .ThenByDescending(e => e.Id_entrada)
                    .FirstOrDefault();

                if (latestEntry != null)
                {
                    latestEntry.existencia_actual = (int)Math.Round(newSaldoBase);
                    if (FunctionsGeneral != null)
                    {
                        FunctionsGeneral.AddLog($"Entrada más reciente ID {latestEntry.Id_entrada} actualizada a {latestEntry.existencia_actual}");
                    }
                }

                _context.SaveChanges();

                if (FunctionsGeneral != null)
                {
                    FunctionsGeneral.AddLog($"=== FIN RecalculateFoodBalance ===");
                }
            }
            catch (Exception ex)
            {
                if (FunctionsGeneral != null)
                {
                    FunctionsGeneral.AddLog($"Error en RecalculateFoodBalance: {ex.Message}");
                    if (ex.InnerException != null)
                    {
                        FunctionsGeneral.AddLog($"Inner Exception: {ex.InnerException.Message}");
                    }
                }
                throw;
            }
        }
    }
}
