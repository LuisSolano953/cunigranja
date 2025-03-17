using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Mvc;
using cunigranja.Functions;
using cunigranja.DTOs;

namespace cunigranja.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class HealthController : Controller
    {
        public readonly HealthServices _Services;
        public IConfiguration _configuration { get; set; }
        public GeneralFunctions FunctionsGeneral;

        public HealthController(IConfiguration configuration, HealthServices healthServices)
        {
            FunctionsGeneral = new GeneralFunctions(configuration);
            _Services = healthServices;
            _configuration = configuration;
        }

        
        [HttpPost("CreateHealth")]
        public IActionResult Add(HealthModel entity)
        {
            try
            {
                _Services.Add(entity);
                return Ok(new { message = "sanidad creado con extito" });
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
        [HttpGet("AllHealth")]
        public ActionResult<IEnumerable<HealthModel>> GetHealth()
        {
            var health = _Services.GetAll().Select(h => new HealthDTO
            {
                Id_health = h.Id_health,
                name_health=h.name_health,
                fecha_health=h.fecha_health,
                descripcion_health=h.descripcion_health,
                valor_health=h.valor_health,
                name_user=h.user.name_user
                 

            }).ToList();

            return Ok(health);
        }

        // GET: api/Health/ConsulHealth?id=1
        [HttpGet("ConsulHealth")]
        public ActionResult<HealthModel> GetHealthById(int id)
        {
            try
            {

                var health = _Services.GetHealthById(id);
                if (health != null)
                {
                    return Ok(health);
                }
                else
                {
                    return NotFound("Health record not found.");
                }
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        // POST: api/Health/UpdateHealth
        [HttpPost("UpdateHealth")]
        public IActionResult UpdateHealth(HealthModel entity)
        {
            try
            {
                if (entity.Id_health <= 0) // Verifica que el ID sea válido
                {
                    return BadRequest("Invalid health ID.");
                }

                // Llamar al método de actualización en el servicio
                _Services.UpdateHealth(entity.Id_health, entity);

                return Ok("Health updated successfully.");
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
        [HttpGet("GetHealthInRange")]
        public ActionResult<IEnumerable<HealthModel>> GetCagesInRange(int startId, int endId)
        {
            try
            {
                var HealthModel = _Services.GetCageInRange(startId, endId);
                if (HealthModel == null || !HealthModel.Any())
                {
                    return NotFound("No Food found in the specified range.");
                }
                return Ok(HealthModel);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }


        }

        // DELETE: api/Health/DeleteHealth?id=1
        [HttpDelete("DeleteHealth")]
        public IActionResult DeleteHealthById(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid health ID.");
                }

                var result = _Services.DeleteById(id);

                if (result)
                {
                    return Ok("Health record deleted successfully.");
                }
                else
                {
                    return NotFound("Health record not found.");
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
