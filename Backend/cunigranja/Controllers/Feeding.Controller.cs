using cunigranja.DTOs;
using cunigranja.Functions;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Mvc;

namespace cunigranja.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class FeedingController : Controller
    {
        
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
                return Ok(new { message = "alimentacion creado con extito" });
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpGet("GetFeeding")]
        //public ActionResult<IEnumerable<FeedingModel>> GetFeeding()
        //{
        //    try
        //    {
        //        return Ok(_Services.GetFeeding());
        //    }
        //    catch (Exception ex)
        //    {
        //        FunctionsGeneral.AddLog(ex.Message);
        //        return StatusCode(500, ex.ToString());
        //    }
        //}
        public ActionResult<IEnumerable<FeedingDTO>> GetsAllFeeding()
        {
          
                var feeding = _Services.GetAll().Select(f => new FeedingDTO
                {
                    Id_feeding = f.Id_feeding,            // int to int (OK)
                    fecha_feeding = f.fecha_feeding,      // DateTime to DateTime (OK)
                    hora_feeding = f.hora_feeding,        // string to string (OK)
                    cantidad_feeding = f.cantidad_feeding, // string to string (OK)
                    name_food = f.foodmodel.name_food,         // string to string (OK)
                }).ToList();

                return Ok(feeding);
           
            
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

        [HttpDelete("DeleteFeeding")]
        public IActionResult DeleteFeedingById(int Id_feeding)
        {
            try
            {
                if (Id_feeding <= 0)
                {
                    return BadRequest("Invalid feeding ID.");
                }

                var result = _Services.DeleteById(Id_feeding);

                if (result)
                {
                    return Ok("Feeding deleted successfully.");
                }
                else
                {
                    return NotFound("Feeding not found.");
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

