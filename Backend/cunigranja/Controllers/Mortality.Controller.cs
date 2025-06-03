using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Mvc;
using cunigranja.Functions;
using cunigranja.DTOs;

namespace cunigranja.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class MortalityController : Controller
    {
        public readonly MortalityServices _Services;
        public IConfiguration _configuration { get; set; }
        public GeneralFunctions FunctionsGeneral;

        public MortalityController(IConfiguration configuration, MortalityServices mortalityServices)
        {
            FunctionsGeneral = new GeneralFunctions(configuration);
            _Services = mortalityServices;
            _configuration = configuration;
        }

        [HttpPost("CreateMortality")]
        public IActionResult Add(MortalityModel entity)
        {
            try
            {
                // Log de los datos recibidos
                Console.WriteLine($"Datos recibidos: Id_rabbit={entity.Id_rabbit}, Id_user={entity.Id_user}, fecha={entity.fecha_mortality}, causa={entity.causa_mortality}");

                _Services.Add(entity);
                return Ok(new { message = "Mortalidad registrada con éxito. El conejo ha sido marcado como inactivo." });
            }
            catch (ArgumentException ex)
            {
                // Errores de validación
                Console.WriteLine($"Error de validación: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Errores generales
                Console.WriteLine($"Error general: {ex.Message}");
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, new { message = "Error interno del servidor", details = ex.Message });
            }
        }

        [HttpGet("AllMortality")]
        public ActionResult<IEnumerable<MortalityDTO>> GetAllsMortality()
        {
            var mortality = _Services.GetAll().Select(t => new MortalityDTO
            {
                Id_mortality = t.Id_mortality,
                causa_mortality = t.causa_mortality,
                fecha_mortality = t.fecha_mortality,
                name_user = t.user.name_user,
                name_rabbit = t.rabbitmodel.name_rabbit,
            }).ToList();

            return Ok(mortality);
        }

        [HttpGet("ConsulMortality")]
        public ActionResult<MortalityModel> GetById(int id)
        {
            try
            {
                var mortality = _Services.GetById(id);
                if (mortality != null)
                {
                    return Ok(mortality);
                }
                else
                {
                    return NotFound("Mortality record not found.");
                }
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost("UpdateMortality")]
        public IActionResult UpdateMortality(MortalityModel entity)
        {
            try
            {
                if (entity.Id_mortality <= 0)
                {
                    return BadRequest("Invalid Mortality ID.");
                }

                Console.WriteLine($"=== UPDATE MORTALITY ===");
                Console.WriteLine($"ID Mortalidad: {entity.Id_mortality}");
                Console.WriteLine($"Conejo Nuevo: {entity.Id_rabbit}");
                Console.WriteLine($"Usuario: {entity.Id_user}");
                Console.WriteLine($"Fecha: {entity.fecha_mortality}");
                Console.WriteLine($"Causa: {entity.causa_mortality}");

                _Services.UpdateMortality(entity.Id_mortality, entity);

                return Ok(new { message = "Mortalidad actualizada exitosamente. Los estados de los conejos han sido actualizados." });
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine($"Error de validación en update: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error general en update: {ex.Message}");
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, new { message = "Error interno del servidor", details = ex.Message });
            }
        }

        [HttpGet("GetMortalityhInRange")]
        public ActionResult<IEnumerable<HealthModel>> GetMortalityInRange(int startId, int endId)
        {
            try
            {
                var mortalityModel = _Services.GetMortalityInRange(startId, endId);
                if (mortalityModel == null || !mortalityModel.Any())
                {
                    return NotFound("No Mortality found in the specified range.");
                }
                return Ok(mortalityModel);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        // DELETE: api/Health/DeleteHealth?id=1
        [HttpDelete("DeleteMortality")]
        public IActionResult DeleteHealthById(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid Mortality ID.");
                }

                var result = _Services.DeleteById(id);

                if (result)
                {
                    return Ok("Mortality record deleted successfully.");
                }
                else
                {
                    return NotFound("Mortality record not found.");
                }
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
    }
}
