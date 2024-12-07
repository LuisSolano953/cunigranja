using cunigranja.Functions;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Mvc;

namespace cunigranja.Controllers
{
<<<<<<< HEAD
    [ApiController]
    [Route("Api/[controller]")]
    public class FeedingController : Controller
    {
        
=======
    public class FeedingController : Controller
    {
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
        public readonly FeedingServices _Services;
        public IConfiguration _configuration { get; set; }
        public GeneralFunctions FunctionsGeneral;

        public FeedingController(IConfiguration configuration, FeedingServices feedingServices)
        {
            FunctionsGeneral = new GeneralFunctions(configuration);
            _configuration = configuration;
            _Services = feedingServices;
        }

        [HttpPost("CreateFeeding")]
        public IActionResult Create(FeedingModel entity)
        {
            try
            {
                _Services.Add(entity);
<<<<<<< HEAD
                return Ok(new { message = "alimentacion creado con extito" });
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

        [HttpGet("GetFeeding")]
        public ActionResult<IEnumerable<FeedingModel>> GetFeeding()
        {
            try
            {
                return Ok(_Services.GetFeeding());
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
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
                return Ok(feeding);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost("UpdateFeeding")]
        public IActionResult UpdateFeeding(FeedingModel entity)
        {
            try
            {
                if (entity.Id_feeding <= 0) // Verifica que el ID sea válido
                {
                    return BadRequest("Invalid feeding ID.");
                }

                // Llamar al método de actualización en el servicio
                _Services.UpdateFeeding(entity.Id_feeding, entity);

                return Ok("Health updated successfully.");
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
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

        [HttpDelete("DeleteCage")]
        public IActionResult DeleteCageById(int id)
        {
            try
            {
                var existingFeeding = _Services.GetFeedingById(id);
                if (existingFeeding == null)
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

