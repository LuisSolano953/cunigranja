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

                _foodServices.UpdateFood(food.Id_food, food);

                // Recalcular todos los registros de alimentación relacionados
                _foodServices.RecalculateFoodBalance(food.Id_food, food.saldo_existente);
            }
            catch (Exception ex)
            {
                // Registrar el error para depuración
                Console.WriteLine($"Error en EntradaServices.Add: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                throw; // Re-lanzar la excepción para que el controlador la maneje
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

                // Calcular la diferencia de cantidad en gramos
                int cantidadOriginalGramos = _foodServices.BultosAKilogramos(entrada.cantidad_entrada);
                int nuevaCantidadGramos = _foodServices.BultosAKilogramos(updatedEntrada.cantidad_entrada);
                int diferenciaGramos = nuevaCantidadGramos - cantidadOriginalGramos;

                // Calcular automáticamente el valor total
                updatedEntrada.valor_total = updatedEntrada.cantidad_entrada * updatedEntrada.valor_entrada;

                // Calcular el nuevo saldo total
                double nuevoSaldoTotal = Math.Round(food.saldo_existente + diferenciaGramos, 2);

                // Actualizar la existencia actual con el saldo total resultante
                updatedEntrada.existencia_actual = (int)nuevoSaldoTotal;

                // Actualizar la entrada
                _context.Entry(entrada).CurrentValues.SetValues(updatedEntrada);
                _context.SaveChanges();

                // Actualizar el saldo existente en la tabla de alimentos (en gramos)
                food.saldo_existente = nuevoSaldoTotal;

                // Asegurarse de que el saldo no sea negativo
                if (food.saldo_existente < 0)
                {
                    food.saldo_existente = 0;
                }

                // Actualizar el estado del alimento según el saldo
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

                _foodServices.UpdateFood(food.Id_food, food);

                // Recalcular todos los registros de alimentación relacionados
                _foodServices.RecalculateFoodBalance(food.Id_food, food.saldo_existente);
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

                        // Restar y redondear a 2 decimales
                        food.saldo_existente = Math.Round(food.saldo_existente - cantidadEntradaGramos, 2);

                        // Asegurarse de que el saldo no sea negativo
                        if (food.saldo_existente < 0)
                        {
                            food.saldo_existente = 0;
                        }

                        // Actualizar el estado del alimento según el saldo
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

                        _foodServices.UpdateFood(food.Id_food, food);

                        // Recalcular todos los registros de alimentación relacionados
                        _foodServices.RecalculateFoodBalance(food.Id_food, food.saldo_existente);
                    }

                    _context.entrada.Remove(entrada);
                    _context.SaveChanges();
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
    }
}
