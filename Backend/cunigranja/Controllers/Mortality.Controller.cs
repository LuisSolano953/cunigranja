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

<<<<<<< HEAD
      
=======
        // GET: api/Health/AllHealth

        // POST: api/Health/CreateHealth
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
        [HttpPost("CreateMortality")]
        public IActionResult Add(MortalityModel entity)
        {
            try
            {
                _Services.Add(entity);
<<<<<<< HEAD
                return Ok(new { message = "mortalidad creado con extito" });
=======
                return Ok();
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
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

<<<<<<< HEAD
=======
        // GET: api/Health/ConsulHealth?id=1
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
        [HttpGet("ConsulMortality")]
        public ActionResult<MortalityModel> GetById(int id)
        {    try
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
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

<<<<<<< HEAD
=======
        // POST: api/Health/UpdateHealth
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
        [HttpPost("UpdateMortality")]
        public IActionResult UpdateMortality(MortalityModel entity)
        {
            try
            {
<<<<<<< HEAD
                if (entity.Id_mortality <= 0) 
=======
                if (entity.Id_mortality <= 0) // Verifica que el ID sea válido
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
                {
                    return BadRequest("Invalid Mortality ID.");
                }

<<<<<<< HEAD
                
=======
                // Llamar al método de actualización en el servicio
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
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
