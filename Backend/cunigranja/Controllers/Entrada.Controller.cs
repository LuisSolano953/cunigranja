using cunigranja.DTOs;
using cunigranja.Functions;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Globalization;

namespace cunigranja.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class EntradaController : Controller
    {
        public readonly EntradaServices _Services;
        public IConfiguration _configuration { get; set; }
        public GeneralFunctions FunctionsGeneral;

        public EntradaController(IConfiguration configuration, EntradaServices entradaServices)
        {
            FunctionsGeneral = new GeneralFunctions(configuration);
            _configuration = configuration;
            _Services = entradaServices;
        }

        [HttpPost("CreateEntrada")]
        public IActionResult Create([FromBody] EntradaModel entity)
        {
            try
            {
                // Validar que los datos necesarios estén presentes
                if (entity == null)
                {
                    return BadRequest("Los datos de entrada son nulos");
                }

                // Registrar los datos recibidos para depuración
                FunctionsGeneral.AddLog($"Datos recibidos: fecha={entity.fecha_entrada}, valor={entity.valor_entrada}, cantidad={entity.cantidad_entrada}, Id_food={entity.Id_food}");

                // Validar que la fecha sea válida
                if (entity.fecha_entrada == default(DateTime))
                {
                    FunctionsGeneral.AddLog("La fecha de entrada es inválida o no se proporcionó");
                    return BadRequest("La fecha de entrada es inválida o no se proporcionó");
                }

                // Validar que la cantidad sea válida
                if (entity.cantidad_entrada <= 0)
                {
                    FunctionsGeneral.AddLog("La cantidad debe ser mayor que cero");
                    return BadRequest("La cantidad debe ser mayor que cero");
                }

                // Validar que el valor sea válido
                if (entity.valor_entrada <= 0)
                {
                    FunctionsGeneral.AddLog("El valor debe ser mayor que cero");
                    return BadRequest("El valor debe ser mayor que cero");
                }

                // Validar que el alimento exista
                if (entity.Id_food <= 0)
                {
                    FunctionsGeneral.AddLog("Debe seleccionar un alimento válido");
                    return BadRequest("Debe seleccionar un alimento válido");
                }

                _Services.Add(entity);
                return Ok(new { message = "Entrada registrada con éxito" });
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog($"Error en CreateEntrada: {ex.Message}");
                if (ex.InnerException != null)
                {
                    FunctionsGeneral.AddLog($"Inner Exception: {ex.InnerException.Message}");
                }
                FunctionsGeneral.AddLog($"Stack Trace: {ex.StackTrace}");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("GetEntrada")]
        public ActionResult<IEnumerable<EntradaDTO>> GetAllsEntrada()
        {
            try
            {
                var entrada = _Services.GetAll().Select(e => new EntradaDTO
                {
                    Id_entrada = e.Id_entrada,
                    cantidad_entrada = e.cantidad_entrada,
                    valor_entrada = e.valor_entrada,
                    fecha_entrada = e.fecha_entrada,
                    name_food = e.foodmodel.name_food,
                    valor_total = e.valor_total,
                    existencia_actual = e.existencia_actual,
                }).ToList();

                return Ok(entrada);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("ConsultEntrada")]
        public ActionResult<EntradaModel> GetEntradaById(int id)
        {
            try
            {
                var entrada = _Services.GetEntradaById(id);
                if (entrada == null)
                {
                    return NotFound();
                }
                return Ok(entrada);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("UpdateEntrada")]
        public IActionResult UpdateEntrada([FromBody] EntradaModel entity)
        {
            try
            {
                if (entity == null)
                {
                    return BadRequest("Los datos de entrada son nulos");
                }

                if (entity.Id_entrada <= 0)
                {
                    return BadRequest("ID de entrada inválido");
                }

                _Services.UpdateEntrada(entity.Id_entrada, entity);
                return Ok("Entrada actualizada con éxito");
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("GetEntradaInRange")]
        public ActionResult<IEnumerable<EntradaModel>> GetEntradaInRange(int startId, int endId)
        {
            try
            {
                var entrada = _Services.GetEntradaInRange(startId, endId);
                if (entrada == null || !entrada.Any())
                {
                    return NotFound("No se encontraron entradas en el rango especificado");
                }
                return Ok(entrada);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("DeleteEntrada")]
        public IActionResult DeleteEntradaById(int id)
        {
            try
            {
                var existingEntrada = _Services.GetEntradaById(id);
                if (existingEntrada == null)
                {
                    return NotFound("Entrada no encontrada");
                }
                _Services.Delete(id);
                return Ok("Entrada eliminada con éxito");
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.Message);
            }
        }
    }
}
