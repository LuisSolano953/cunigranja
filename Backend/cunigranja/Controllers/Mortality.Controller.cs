using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Mvc;
using cunigranja.Functions;

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

        // GET: api/Health/AllHealth

        // POST: api/Health/CreateHealth
        [HttpPost("CreateMortality")]
        public IActionResult Add(MortalityModel entity)
        {
            try
            {
                _Services.Add(entity);
                return Ok();
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
        [HttpGet("AllMortality")]
        public ActionResult<IEnumerable<MortalityModel>> GetMortality()
        {
            return Ok(_Services.GetMortality());
        }

        // GET: api/Health/ConsulHealth?id=1
        [HttpGet("ConsulMortality")]
        public ActionResult<MortalityModel> GetById(int id)
        {
            var health = _Services.GetById(id);
            if (health != null)
            {
                return Ok(health);
            }
            else
            {
                return NotFound("Mortality record not found.");
            }
        }

        // POST: api/Health/UpdateHealth
        [HttpPost("UpdateMortality")]
        public IActionResult UpdateMortality(MortalityModel entity)
        {
            try
            {
                if (entity.Id_mortality <= 0) // Verifica que el ID sea válido
                {
                    return BadRequest("Invalid Mortality ID.");
                }

                // Llamar al método de actualización en el servicio
                _Services.UpdateMortality(entity.Id_mortality, entity);

                return Ok("Mortality updated successfully.");
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
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
