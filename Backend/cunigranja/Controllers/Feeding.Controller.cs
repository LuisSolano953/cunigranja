using cunigranja.DTOs;
using cunigranja.Functions;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Globalization;

namespace cunigranja.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class FeedingController : Controller
    {
        public readonly FeedingServices _Services;
        public readonly FoodServices _foodServices;
        private readonly AppDbContext _context;
        public IConfiguration _configuration { get; set; }
        public GeneralFunctions FunctionsGeneral;

        public FeedingController(IConfiguration configuration, FeedingServices feedingServices, FoodServices foodServices, AppDbContext context)
        {
            FunctionsGeneral = new GeneralFunctions(configuration);
            _configuration = configuration;
            _Services = feedingServices;
            _foodServices = foodServices;
            _context = context;
        }

        [HttpPost("CreateFeeding")]
        public IActionResult Add([FromBody] FeedingModel entity, [FromQuery] bool skipRecalculation = false)
        {
            try
            {
                // Registrar los datos recibidos para depuración
                FunctionsGeneral.AddLog($"Datos recibidos: Id_food={entity.Id_food}, cantidad={entity.cantidad_feeding}, Id_rabbit={entity.Id_rabbit}, Id_user={entity.Id_user}, hora={entity.hora_feeding}, skipRecalculation={skipRecalculation}");

                // Validar que todos los campos necesarios estén presentes
                if (entity == null)
                {
                    return BadRequest("Los datos de alimentación son nulos");
                }

                if (entity.Id_food <= 0)
                {
                    return BadRequest("Debe seleccionar un alimento válido");
                }

                if (entity.Id_rabbit <= 0)
                {
                    return BadRequest("Debe seleccionar un conejo válido");
                }

                if (entity.Id_user <= 0)
                {
                    return BadRequest("Debe seleccionar un usuario válido");
                }

                if (entity.cantidad_feeding <= 0)
                {
                    return BadRequest("La cantidad debe ser mayor que cero");
                }

                if (entity.fecha_feeding == default(DateTime))
                {
                    return BadRequest("La fecha es obligatoria");
                }

                if (string.IsNullOrEmpty(entity.hora_feeding))
                {
                    return BadRequest("La hora es obligatoria");
                }

                // Si se solicita omitir la recalculación, usar el método directo
                if (skipRecalculation)
                {
                    CreateFeedingDirectly(entity);
                }
                else
                {
                    // Intentar usar el método estándar, pero con manejo de errores mejorado
                    try
                    {
                        _Services.Add(entity);
                    }
                    catch (Exception ex) when (ex.Message.Contains("transaction") || (ex.InnerException != null && ex.InnerException.Message.Contains("transaction")))
                    {
                        // Si hay un error de transacción, intentar el método directo
                        FunctionsGeneral.AddLog($"Error de transacción detectado, intentando método directo: {ex.Message}");
                        CreateFeedingDirectly(entity);
                    }
                }

                return Ok(new { message = "Alimentación registrada con éxito" });
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog($"Error en CreateFeeding: {ex.Message}");
                if (ex.InnerException != null)
                {
                    FunctionsGeneral.AddLog($"Inner Exception: {ex.InnerException.Message}");
                }
                FunctionsGeneral.AddLog($"Stack Trace: {ex.StackTrace}");
                return StatusCode(500, ex.Message);
            }
        }

        // Método para crear un registro de alimentación directamente sin usar transacciones anidadas
        private void CreateFeedingDirectly(FeedingModel entity)
        {
            FunctionsGeneral.AddLog("Usando método CreateFeedingDirectly");

            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // 1. Validar que el alimento exista
                    var food = _context.food.Find(entity.Id_food);
                    if (food == null)
                    {
                        throw new Exception($"El alimento con ID {entity.Id_food} no existe.");
                    }

                    // 2. Validar que el alimento no esté inactivo
                    if (food.estado_food == "Inactivo")
                    {
                        throw new Exception("El alimento está inactivo y no puede ser utilizado.");
                    }

                    // 3. Ya no convertimos a kilogramos, usamos directamente los gramos
                    double cantidadAlimentacion = entity.cantidad_feeding;
                    cantidadAlimentacion = Math.Round(cantidadAlimentacion, 2);

                    // 4. Validar que haya suficiente alimento
                    if (food.saldo_existente < cantidadAlimentacion)
                    {
                        throw new Exception($"No hay suficiente alimento. Saldo disponible: {Math.Round(food.saldo_existente, 1)} g");
                    }

                    // 5. Calcular el nuevo saldo en gramos
                    double nuevoSaldo = Math.Round(food.saldo_existente - cantidadAlimentacion, 2);

                    // 6. Actualizar la existencia actual en la entidad de alimentación
                    entity.existencia_actual = Math.Round(nuevoSaldo, 1);

                    // 7. Registrar la alimentación
                    _context.feeding.Add(entity);
                    _context.SaveChanges();

                    // 8. Actualizar el saldo del alimento
                    food.saldo_existente = nuevoSaldo;

                    // 9. Actualizar el estado del alimento según el saldo
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

                    _context.SaveChanges();

                    // 10. Confirmar la transacción
                    transaction.Commit();

                    FunctionsGeneral.AddLog($"CreateFeedingDirectly: Registro creado exitosamente. Nuevo saldo: {nuevoSaldo}");
                }
                catch (Exception ex)
                {
                    // Revertir la transacción en caso de error
                    transaction.Rollback();
                    FunctionsGeneral.AddLog($"Error en CreateFeedingDirectly: {ex.Message}");
                    throw;
                }
            }
        }

        [HttpPost("CreateFeedingSimple")]
        public IActionResult AddSimple([FromBody] FeedingModel entity)
        {
            try
            {
                // Este es un endpoint alternativo que siempre usa el método directo
                // sin intentar usar el servicio estándar primero
                FunctionsGeneral.AddLog($"CreateFeedingSimple: Id_food={entity.Id_food}, cantidad={entity.cantidad_feeding}");

                // Validaciones básicas
                if (entity == null || entity.Id_food <= 0 || entity.Id_rabbit <= 0 ||
                    entity.Id_user <= 0 || entity.cantidad_feeding <= 0)
                {
                    return BadRequest("Datos de alimentación inválidos");
                }

                // Usar el método directo
                CreateFeedingDirectly(entity);

                return Ok(new { message = "Alimentación registrada con éxito" });
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog($"Error en CreateFeedingSimple: {ex.Message}");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("GetFeeding")]
        public ActionResult<IEnumerable<FeedingDTO>> GetsAllFeeding()
        {
            try
            {
                var feeding = _Services.GetAll().Select(f => new FeedingDTO
                {
                    Id_feeding = f.Id_feeding,
                    fecha_feeding = f.fecha_feeding,
                    hora_feeding = f.hora_feeding,
                    cantidad_feeding = f.cantidad_feeding,
                    name_food = f.foodmodel?.name_food ?? "Desconocido",
                    name_user = f.user?.name_user ?? "Desconocido",
                    name_rabbit = f.rabbitmodel?.name_rabbit ?? "Desconocido",
                    existencia_actual = f.existencia_actual,
                    Id_food = f.Id_food
                }).ToList();

                return Ok(feeding);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog($"Error en GetFeeding: {ex.Message}");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("GetAvailableFood")]
        public ActionResult<IEnumerable<FoodModel>> GetAvailableFood()
        {
            try
            {
                // Obtener todos los alimentos disponibles (no inactivos)
                var availableFood = _foodServices.GetFood()
                    .Where(f => f.estado_food != "Inactivo" && f.saldo_existente > 0)
                    .ToList();

                FunctionsGeneral.AddLog($"GetAvailableFood: Encontrados {availableFood.Count} alimentos disponibles");

                return Ok(availableFood);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog($"Error en GetAvailableFood: {ex.Message}");
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpGet("ConsultFeeding")]
        public ActionResult<FeedingModel> GetFeedingById(int id)
        {
            try
            {
                var feeding = _Services.GetFeedingById(id);
                if (feeding == null)
                {
                    return NotFound();
                }

                // Obtener el saldo actual del alimento para asegurar sincronización
                var food = _foodServices.GetFoodById(feeding.Id_food);
                if (food != null)
                {
                    // Ya no convertimos a kilogramos, usamos directamente los gramos
                    double cantidadAlimentacion = feeding.cantidad_feeding;

                    // Registrar los valores para depuración
                    FunctionsGeneral.AddLog($"ConsultFeeding: ID={id}, Alimento ID={feeding.Id_food}, Saldo alimento={food.saldo_existente}, Cantidad={cantidadAlimentacion}");

                    // Actualizar la existencia actual con el saldo actual del alimento MENOS esta alimentación
                    double saldoDespuesDeAlimentacion = Math.Round(food.saldo_existente - cantidadAlimentacion, 2);
                    feeding.existencia_actual = Math.Round(saldoDespuesDeAlimentacion, 1);

                    // No guardamos los cambios en la base de datos, solo actualizamos el objeto que se devuelve
                    FunctionsGeneral.AddLog($"ConsultFeeding: Actualizada existencia actual a {feeding.existencia_actual} para mostrar en formulario");
                }

                return Ok(feeding);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog($"Error en ConsultFeeding: {ex.Message}");
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost("UpdateFeeding")]
        public IActionResult UpdateFeeding([FromBody] FeedingModel entity)
        {
            try
            {
                if (entity.Id_feeding <= 0)
                {
                    return BadRequest("Invalid feeding ID.");
                }

                // Obtener el registro original para comparación
                var originalFeeding = _Services.GetFeedingById(entity.Id_feeding);
                if (originalFeeding == null)
                {
                    return NotFound("Registro de alimentación no encontrado.");
                }

                // Registrar los datos para depuración
                FunctionsGeneral.AddLog($"UpdateFeeding: ID={entity.Id_feeding}, Cantidad original={originalFeeding.cantidad_feeding}, Nueva cantidad={entity.cantidad_feeding}");

                // Ignorar el valor de existencia_actual enviado desde el cliente
                // El valor correcto será calculado por el servicio

                // Usar un enfoque directo para actualizar sin transacciones anidadas
                UpdateFeedingDirectly(entity, originalFeeding);

                // Obtener el registro actualizado con los valores correctos
                var updatedFeeding = _Services.GetFeedingById(entity.Id_feeding);

                return Ok(new
                {
                    message = "Alimentación actualizada con éxito.",
                    feeding = updatedFeeding // Devolver el objeto actualizado con los valores correctos
                });
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog($"Error en UpdateFeeding: {ex.Message}");
                return StatusCode(500, ex.Message);
            }
        }

        // Método para actualizar un registro de alimentación directamente sin usar transacciones anidadas
        private void UpdateFeedingDirectly(FeedingModel updatedFeeding, FeedingModel originalFeeding)
        {
            FunctionsGeneral.AddLog("Usando método UpdateFeedingDirectly");

            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // Obtener los alimentos involucrados
                    int originalFoodId = originalFeeding.Id_food;
                    int newFoodId = updatedFeeding.Id_food;

                    // Obtener el alimento original
                    var originalFood = _context.food.Find(originalFoodId);
                    if (originalFood == null)
                    {
                        throw new Exception($"El alimento original con ID {originalFoodId} no existe.");
                    }

                    // Obtener el nuevo alimento (si es diferente)
                    var newFood = originalFoodId == newFoodId ? originalFood : _context.food.Find(newFoodId);
                    if (newFood == null)
                    {
                        throw new Exception($"El nuevo alimento con ID {newFoodId} no existe.");
                    }

                    // Validar que el alimento no esté inactivo (a menos que sea el mismo registro)
                    if (newFood.estado_food == "Inactivo" && originalFoodId != newFoodId)
                    {
                        throw new Exception("El alimento está inactivo y no puede ser utilizado.");
                    }

                    // Ya no convertimos a kilogramos, usamos directamente los gramos
                    double cantidadOriginal = originalFeeding.cantidad_feeding;
                    double nuevaCantidad = updatedFeeding.cantidad_feeding;

                    // Redondear a 2 decimales para cálculos internos
                    cantidadOriginal = Math.Round(cantidadOriginal, 2);
                    nuevaCantidad = Math.Round(nuevaCantidad, 2);

                    FunctionsGeneral.AddLog($"UpdateFeedingDirectly: ID={updatedFeeding.Id_feeding}, Alimento original ID={originalFoodId}, Nuevo alimento ID={newFoodId}, Cantidad original={cantidadOriginal}, Nueva cantidad={nuevaCantidad}");

                    // Si el alimento ha cambiado, necesitamos actualizar ambos alimentos
                    if (originalFoodId != newFoodId)
                    {
                        // 1. Devolver la cantidad original al alimento original
                        double nuevoSaldoOriginal = Math.Round(originalFood.saldo_existente + cantidadOriginal, 2);

                        // 2. Restar la nueva cantidad del nuevo alimento
                        if (newFood.saldo_existente < nuevaCantidad)
                        {
                            throw new Exception($"No hay suficiente alimento. Saldo disponible: {Math.Round(newFood.saldo_existente, 1)} g");
                        }

                        double nuevoSaldoNuevo = Math.Round(newFood.saldo_existente - nuevaCantidad, 2);

                        FunctionsGeneral.AddLog($"UpdateFeedingDirectly: Alimento original ID={originalFoodId} nuevo saldo={nuevoSaldoOriginal}, Nuevo alimento ID={newFoodId} nuevo saldo={nuevoSaldoNuevo}");

                        // Actualizar la alimentación
                        updatedFeeding.existencia_actual = Math.Round(nuevoSaldoNuevo, 1);
                        _context.Entry(originalFeeding).CurrentValues.SetValues(updatedFeeding);
                        _context.SaveChanges();

                        // Actualizar ambos alimentos
                        originalFood.saldo_existente = nuevoSaldoOriginal;
                        if (originalFood.saldo_existente <= 0)
                        {
                            originalFood.estado_food = "Inactivo";
                        }
                        else if (originalFood.saldo_existente <= 5000) // 5kg = 5000g
                        {
                            originalFood.estado_food = "Casi por acabar";
                        }
                        else
                        {
                            originalFood.estado_food = "Existente";
                        }
                        _context.SaveChanges();

                        newFood.saldo_existente = nuevoSaldoNuevo;
                        if (newFood.saldo_existente <= 0)
                        {
                            newFood.estado_food = "Inactivo";
                        }
                        else if (newFood.saldo_existente <= 5000) // 5kg = 5000g
                        {
                            newFood.estado_food = "Casi por acabar";
                        }
                        else
                        {
                            newFood.estado_food = "Existente";
                        }
                        _context.SaveChanges();
                    }
                    else
                    {
                        // El alimento no ha cambiado, solo la cantidad
                        // Calcular la diferencia de cantidad en gramos
                        double diferencia = nuevaCantidad - cantidadOriginal;
                        diferencia = Math.Round(diferencia, 2);

                        // Si la cantidad aumenta, verificar si hay suficiente alimento
                        if (diferencia > 0 && newFood.saldo_existente < diferencia)
                        {
                            throw new Exception($"No hay suficiente alimento. Saldo disponible: {Math.Round(newFood.saldo_existente, 1)} g");
                        }

                        // Calcular el nuevo saldo en gramos
                        double nuevoSaldo = Math.Round(newFood.saldo_existente - diferencia, 2);

                        FunctionsGeneral.AddLog($"UpdateFeedingDirectly: Mismo alimento ID={newFoodId}, Diferencia={diferencia}, Nuevo saldo={nuevoSaldo}");

                        // Actualizar la alimentación
                        updatedFeeding.existencia_actual = Math.Round(nuevoSaldo, 1);
                        _context.Entry(originalFeeding).CurrentValues.SetValues(updatedFeeding);
                        _context.SaveChanges();

                        // Actualizar el saldo existente en la tabla de alimentos
                        newFood.saldo_existente = nuevoSaldo;
                        if (newFood.saldo_existente <= 0)
                        {
                            newFood.estado_food = "Inactivo";
                        }
                        else if (newFood.saldo_existente <= 5000) // 5kg = 5000g
                        {
                            newFood.estado_food = "Casi por acabar";
                        }
                        else
                        {
                            newFood.estado_food = "Existente";
                        }
                        _context.SaveChanges();
                    }

                    transaction.Commit();
                    FunctionsGeneral.AddLog($"UpdateFeedingDirectly: Transacción completada con éxito");
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    FunctionsGeneral.AddLog($"Error en UpdateFeedingDirectly: {ex.Message}");
                    throw;
                }
            }
        }

        [HttpGet("GetFeedingInRange")]
        public ActionResult<IEnumerable<FeedingModel>> GetFeedingInRange(int startId, int endId)
        {
            try
            {
                var feeding = _Services.GetFeedingInRange(startId, endId);
                if (feeding == null || !feeding.Any())
                {
                    return NotFound("No cage found in the specified range.");
                }
                return Ok(feeding);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpDelete("DeleteFeeding")]
        public IActionResult DeleteFeedingById(int Id)
        {
            try
            {
                var existingFeeding = _Services.GetFeedingById(Id);
                if (existingFeeding == null)
                {
                    return NotFound();
                }
                _Services.DeleteById(Id);
                return Ok();
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpGet("GetFeedingByFood/{foodId}")]
        public ActionResult<IEnumerable<FeedingDTO>> GetFeedingByFood(int foodId)
        {
            try
            {
                // Registrar la solicitud para depuración
                FunctionsGeneral.AddLog($"GetFeedingByFood: Buscando registros para alimento ID {foodId}");

                // Obtener todas las alimentaciones y filtrar por ID de alimento
                var feedings = _Services.GetAll()
                    .Where(f => f.Id_food == foodId)
                    .Select(f => new FeedingDTO
                    {
                        Id_feeding = f.Id_feeding,
                        fecha_feeding = f.fecha_feeding,
                        hora_feeding = f.hora_feeding,
                        cantidad_feeding = f.cantidad_feeding,
                        name_food = f.foodmodel?.name_food ?? "Desconocido",
                        name_user = f.user?.name_user ?? "Desconocido",
                        name_rabbit = f.rabbitmodel?.name_rabbit ?? "Desconocido",
                        existencia_actual = f.existencia_actual,
                        Id_food = f.Id_food
                    }).ToList();

                FunctionsGeneral.AddLog($"GetFeedingByFood: Encontrados {feedings.Count} registros para alimento ID {foodId}");

                return Ok(feedings);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog($"Error en GetFeedingByFood: {ex.Message}");
                return StatusCode(500, ex.Message);
            }
        }
    }
}
