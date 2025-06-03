using cunigranja.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace cunigranja.Services
{
    public class EntradaServices
    {
        private readonly AppDbContext _context;
        private readonly FoodServices _foodServices;

        public EntradaServices(AppDbContext context, FoodServices foodServices)
        {
            _context = context;
            _foodServices = foodServices;
        }

        public IEnumerable<EntradaModel> GetAll()
        {
            return _context.entrada.Include(e => e.foodmodel).ToList();
        }

        public EntradaModel GetEntradaById(int id)
        {
            return _context.entrada.FirstOrDefault(c => c.Id_entrada == id);
        }

        public void Add(EntradaModel entity)
        {
            try
            {
                // Validar que todos los campos necesarios estén presentes
                if (entity == null)
                {
                    throw new ArgumentNullException(nameof(entity), "La entidad no puede ser nula");
                }

                // Validar que el alimento exista
                var food = _foodServices.GetFoodById(entity.Id_food);
                if (food == null)
                {
                    throw new Exception($"El alimento con ID {entity.Id_food} no existe.");
                }

                // Calcular automáticamente el valor total
                entity.valor_total = entity.cantidad_entrada * entity.valor_entrada;

                // Convertir la cantidad de entrada (bultos) a gramos
                int cantidadEntradaGramos = _foodServices.BultosAKilogramos(entity.cantidad_entrada);

                // Obtener el saldo existente actual del alimento
                double saldoExistenteActual = food.saldo_existente;

                // Calcular el nuevo saldo total (saldo existente + cantidad entrada)
                double nuevoSaldoTotal = Math.Round(saldoExistenteActual + cantidadEntradaGramos, 2);

                // Guardar el saldo total resultante en existencia_actual
                entity.existencia_actual = (int)nuevoSaldoTotal;

                // Registrar la entrada
                _context.entrada.Add(entity);
                _context.SaveChanges();

                // Actualizar el saldo existente en la tabla de alimentos (en gramos)
                food.saldo_existente = nuevoSaldoTotal;

                // Actualizar el estado del alimento según el saldo
                UpdateFoodStatus(food);

                // Actualizar el alimento SIN recalcular (solo guardamos el nuevo saldo)
                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        _context.Entry(food).State = EntityState.Modified;
                        _context.SaveChanges();
                        transaction.Commit();
                    }
                    catch
                    {
                        transaction.Rollback();
                        throw;
                    }
                }

                // Ahora actualizamos los registros de alimentación con el nuevo saldo base
                ActualizarRegistrosAlimentacion(food.Id_food, nuevoSaldoTotal);

                Console.WriteLine($"Entrada agregada correctamente. Nuevo saldo: {nuevoSaldoTotal}g");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en EntradaServices.Add: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                throw;
            }
        }

        public void UpdateEntrada(int Id, EntradaModel updatedEntrada)
        {
            try
            {
                // Obtener la entrada original
                var entrada = _context.entrada.SingleOrDefault(u => u.Id_entrada == Id);
                if (entrada == null)
                {
                    throw new Exception($"La entrada con ID {Id} no existe.");
                }

                // Obtener el alimento
                var food = _foodServices.GetFoodById(updatedEntrada.Id_food);
                if (food == null)
                {
                    throw new Exception($"El alimento con ID {updatedEntrada.Id_food} no existe.");
                }

                Console.WriteLine($"=== INICIO UPDATE ENTRADA {Id} ===");
                Console.WriteLine($"Cantidad original: {entrada.cantidad_entrada} bultos");
                Console.WriteLine($"Nueva cantidad: {updatedEntrada.cantidad_entrada} bultos");
                Console.WriteLine($"Saldo actual del alimento: {food.saldo_existente} gramos");

                // Guardar el saldo actual antes de cualquier modificación
                double saldoOriginalAlimento = food.saldo_existente;

                // PASO 1: Calcular la diferencia entre la entrada original y la actualizada
                int cantidadOriginalGramos = _foodServices.BultosAKilogramos(entrada.cantidad_entrada);
                int nuevaCantidadGramos = _foodServices.BultosAKilogramos(updatedEntrada.cantidad_entrada);
                int diferenciaGramos = nuevaCantidadGramos - cantidadOriginalGramos;

                Console.WriteLine($"Cantidad original: {cantidadOriginalGramos} gramos");
                Console.WriteLine($"Nueva cantidad: {nuevaCantidadGramos} gramos");
                Console.WriteLine($"Diferencia: {diferenciaGramos} gramos");

                // PASO 2: Calcular el nuevo saldo sumando la diferencia
                double nuevoSaldoTotal = Math.Round(saldoOriginalAlimento + diferenciaGramos, 2);
                Console.WriteLine($"Nuevo saldo calculado: {nuevoSaldoTotal} gramos");

                // PASO 3: Calcular automáticamente el valor total
                updatedEntrada.valor_total = updatedEntrada.cantidad_entrada * updatedEntrada.valor_entrada;

                // PASO 4: Actualizar la existencia actual con el saldo total resultante
                updatedEntrada.existencia_actual = (int)nuevoSaldoTotal;

                // PASO 5: Actualizar la entrada en la base de datos
                _context.Entry(entrada).CurrentValues.SetValues(updatedEntrada);
                _context.SaveChanges();

                // PASO 6: Actualizar el saldo existente en la tabla de alimentos
                food.saldo_existente = nuevoSaldoTotal;

                // Asegurarse de que el saldo no sea negativo
                if (food.saldo_existente < 0)
                {
                    Console.WriteLine($"ADVERTENCIA: Saldo negativo detectado, ajustando a 0");
                    food.saldo_existente = 0;
                }

                // PASO 7: Actualizar el estado del alimento según el saldo
                UpdateFoodStatus(food);

                // PASO 8: Guardar cambios en el alimento SIN usar RecalculateFoodBalance
                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        _context.Entry(food).State = EntityState.Modified;
                        _context.SaveChanges();
                        transaction.Commit();
                    }
                    catch
                    {
                        transaction.Rollback();
                        throw;
                    }
                }

                // PASO 9: Actualizar los registros de alimentación con el nuevo saldo base
                ActualizarRegistrosAlimentacion(food.Id_food, nuevoSaldoTotal);

                Console.WriteLine($"=== FIN UPDATE ENTRADA {Id} ===");
                Console.WriteLine($"Saldo final del alimento: {food.saldo_existente} gramos");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en EntradaServices.UpdateEntrada: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                throw;
            }
        }

        public void Delete(int id)
        {
            try
            {
                var entrada = _context.entrada.FirstOrDefault(c => c.Id_entrada == id);
                if (entrada != null)
                {
                    // Obtener el alimento para actualizar su saldo
                    var food = _foodServices.GetFoodById(entrada.Id_food);
                    if (food != null)
                    {
                        // Restar la cantidad de la entrada (en gramos) del saldo existente
                        int cantidadEntradaGramos = _foodServices.BultosAKilogramos(entrada.cantidad_entrada);

                        Console.WriteLine($"=== ELIMINANDO ENTRADA {id} ===");
                        Console.WriteLine($"Saldo actual: {food.saldo_existente} gramos");
                        Console.WriteLine($"Cantidad a restar: {cantidadEntradaGramos} gramos");

                        // Restar y redondear a 2 decimales
                        double nuevoSaldo = Math.Round(food.saldo_existente - cantidadEntradaGramos, 2);

                        // Asegurarse de que el saldo no sea negativo
                        if (nuevoSaldo < 0)
                        {
                            nuevoSaldo = 0;
                        }

                        food.saldo_existente = nuevoSaldo;
                        Console.WriteLine($"Nuevo saldo calculado: {nuevoSaldo} gramos");

                        // Actualizar el estado del alimento según el saldo
                        UpdateFoodStatus(food);

                        // Actualizar el alimento SIN usar RecalculateFoodBalance
                        using (var transaction = _context.Database.BeginTransaction())
                        {
                            try
                            {
                                _context.Entry(food).State = EntityState.Modified;
                                _context.SaveChanges();
                                transaction.Commit();
                            }
                            catch
                            {
                                transaction.Rollback();
                                throw;
                            }
                        }

                        // Actualizar los registros de alimentación con el nuevo saldo base
                        ActualizarRegistrosAlimentacion(food.Id_food, nuevoSaldo);
                    }

                    _context.entrada.Remove(entrada);
                    _context.SaveChanges();

                    Console.WriteLine($"=== ENTRADA {id} ELIMINADA ===");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en EntradaServices.Delete: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                throw;
            }
        }

        public IEnumerable<EntradaModel> GetEntradaInRange(int startId, int endId)
        {
            return _context.entrada
                           .Where(u => u.Id_entrada >= startId && u.Id_entrada <= endId)
                           .ToList();
        }

        // Método auxiliar para actualizar el estado del alimento
        private void UpdateFoodStatus(FoodModel food)
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

        // Método mejorado para actualizar los registros de alimentación
        private void ActualizarRegistrosAlimentacion(int foodId, double saldoBase)
        {
            try
            {
                Console.WriteLine($"=== ACTUALIZANDO REGISTROS DE ALIMENTACIÓN ===");
                Console.WriteLine($"Alimento ID: {foodId}");
                Console.WriteLine($"Saldo base: {saldoBase} gramos");

                // Obtener todos los registros de alimentación para este alimento
                // ordenados por fecha ascendente (del más antiguo al más reciente)
                var feedingRecords = _context.feeding
                    .Where(f => f.Id_food == foodId)
                    .OrderBy(f => f.fecha_feeding)
                    .ThenBy(f => f.hora_feeding)
                    .ThenBy(f => f.Id_feeding)
                    .ToList();

                Console.WriteLine($"Registros de alimentación encontrados: {feedingRecords.Count}");

                if (feedingRecords.Any())
                {
                    // Recalcular cada registro secuencialmente desde el saldo base
                    double saldoActual = saldoBase;

                    foreach (var feeding in feedingRecords)
                    {
                        // Restar la cantidad de esta alimentación del saldo actual
                        double cantidadGramos = (double)feeding.cantidad_feeding;
                        saldoActual = Math.Round(saldoActual - cantidadGramos, 2);

                        // Asegurar que no sea negativo
                        if (saldoActual < 0)
                        {
                            saldoActual = 0;
                        }

                        // Actualizar la existencia actual de este registro
                        feeding.existencia_actual = saldoActual;

                        Console.WriteLine($"Registro ID {feeding.Id_feeding}: -{cantidadGramos}g, saldo resultante: {saldoActual}g");
                    }

                    // Guardar todos los cambios
                    _context.SaveChanges();
                }

                Console.WriteLine($"=== FIN ACTUALIZACIÓN REGISTROS DE ALIMENTACIÓN ===");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en ActualizarRegistrosAlimentacion: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                throw;
            }
        }
    }
}