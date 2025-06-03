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

                        if (updatedFood.saldo_existente <= 0 && updatedFood.estado_food != "Inactivo")
                        {
                            updatedFood.estado_food = "Inactivo";
                        }

                        UpdateFoodState(updatedFood);
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

        // MÉTODO CORREGIDO: RecalculateFoodBalance
        public void RecalculateFoodBalance(int foodId, double newSaldoBase)
        {
            try
            {
                if (FunctionsGeneral != null)
                {
                    FunctionsGeneral.AddLog($"=== INICIO RecalculateFoodBalance ===");
                    FunctionsGeneral.AddLog($"Alimento ID: {foodId}, Nuevo saldo base: {newSaldoBase}");
                }

                // NO usar transacción aquí porque puede ser llamado desde otra transacción
                // El contexto ya debería estar en una transacción desde el método que llama

                // 1. Obtener el alimento y actualizar su saldo
                var food = _context.food.Find(foodId);
                if (food == null)
                {
                    throw new Exception($"Alimento con ID {foodId} no encontrado");
                }

                // Redondear el saldo base
                newSaldoBase = Math.Round(newSaldoBase, 2);
                food.saldo_existente = newSaldoBase;
                UpdateFoodState(food);

                // 2. Obtener TODOS los registros de alimentación para este alimento
                // ORDENADOS POR FECHA ASCENDENTE (del más antiguo al más reciente)
                var feedingRecords = _context.feeding
                    .Where(f => f.Id_food == foodId)
                    .OrderBy(f => f.fecha_feeding)
                    .ThenBy(f => f.hora_feeding)
                    .ThenBy(f => f.Id_feeding) // Para asegurar orden consistente
                    .ToList();

                if (FunctionsGeneral != null)
                {
                    FunctionsGeneral.AddLog($"Encontrados {feedingRecords.Count} registros de alimentación");
                }

                if (feedingRecords.Any())
                {
                    // 3. Recalcular cada registro secuencialmente desde el saldo base
                    double saldoActual = newSaldoBase;

                    foreach (var feeding in feedingRecords)
                    {
                        // Restar la cantidad de esta alimentación del saldo actual
                        // CORREGIDO: Especificar explícitamente el tipo double para resolver la ambigüedad
                        double cantidadGramos = (double)Math.Round((double)feeding.cantidad_feeding, 2);
                        saldoActual = Math.Round(saldoActual - cantidadGramos, 2);

                        // Asegurar que no sea negativo
                        if (saldoActual < 0)
                        {
                            saldoActual = 0;
                        }

                        // Actualizar la existencia actual de este registro
                        // CORREGIDO: Especificar explícitamente el tipo double para resolver la ambigüedad
                        feeding.existencia_actual = (double)Math.Round(saldoActual, 1);

                        if (FunctionsGeneral != null)
                        {
                            FunctionsGeneral.AddLog($"Registro ID {feeding.Id_feeding}: -{cantidadGramos}g, saldo resultante: {saldoActual}g");
                        }
                    }

                    // 4. Actualizar el saldo final del alimento
                    food.saldo_existente = saldoActual;
                    UpdateFoodState(food);

                    if (FunctionsGeneral != null)
                    {
                        FunctionsGeneral.AddLog($"Saldo final del alimento: {saldoActual}g");
                    }
                }

                // 5. Actualizar la entrada más reciente con el saldo base
                var latestEntry = _context.entrada
                    .Where(e => e.Id_food == foodId)
                    .OrderByDescending(e => e.fecha_entrada)
                    .ThenByDescending(e => e.Id_entrada)
                    .FirstOrDefault();

                if (latestEntry != null)
                {
                    // CORREGIDO: Especificar explícitamente el tipo double para resolver la ambigüedad
                    latestEntry.existencia_actual = (int)Math.Round(newSaldoBase);
                    if (FunctionsGeneral != null)
                    {
                        FunctionsGeneral.AddLog($"Entrada más reciente ID {latestEntry.Id_entrada} actualizada a {latestEntry.existencia_actual}");
                    }
                }

                // 6. Guardar todos los cambios
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