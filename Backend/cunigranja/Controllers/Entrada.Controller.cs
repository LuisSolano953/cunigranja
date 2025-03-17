using cunigranja.DTOs;
using cunigranja.Functions;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Mvc;

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
        public IActionResult Create(EntradaModel entity)
        {
            try
            {
                _Services.Add(entity);
                return Ok(new { message = "Entrada creado con extito" });
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpGet("GetEntrada")]
        public ActionResult<IEnumerable<EntradaDTO>> GetAllsEntrada()
        {
            var entrada = _Services.GetAll().Select(e => new EntradaDTO
            {
               Id_entrada = e.Id_entrada,
                cantidad_entrada =e.cantidad_entrada,
                valor_entrada=e.valor_entrada,
                fecha_entrada = e.fecha_entrada,
                cantidad_feeding= e.feedingmodel.cantidad_feeding,

            }).ToList();

            return Ok(entrada);
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
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost("UpdateEntrada")]
        public IActionResult UpdateEntrada(EntradaModel entity)
        {
            try
            {
                if (entity.Id_entrada <= 0) // Verifica que el ID sea válido
                {
                    return BadRequest("Invalid Entrada ID.");
                }

                // Llamar al método de actualización en el servicio
                _Services.UpdateEntrada(entity.Id_entrada, entity);

                return Ok("Entrada updated successfully.");
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
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
                    return NotFound("No Entrada found in the specified range.");
                }
                return Ok(entrada);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
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
                    return NotFound();
                }
                _Services.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
    }
}
