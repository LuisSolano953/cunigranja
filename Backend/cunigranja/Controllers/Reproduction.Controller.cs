using cunigranja.Functions;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Mvc;

namespace cunigranja.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class ReproductionController : Controller
    {
        public readonly ReproductionServices _Services;
        public IConfiguration _configuration { get; set; }
        public GeneralFunctions FunctionsGeneral;
        public ReproductionController(IConfiguration configuration, ReproductionServices reproductionServices)
        {
            FunctionsGeneral = new GeneralFunctions(configuration);
            _configuration = configuration;
            _Services = reproductionServices;
        }
        [HttpPost("CreateReproduction")]
        public IActionResult create(ReproductionModel entity)

        {
            try
            {
                _Services.Add(entity);
                return Ok(new { message = "reproduccion creado con extito" });
            }
                catch (Exception ex)
                {
                    FunctionsGeneral.AddLog(ex.Message);
                    return StatusCode(500, ex.ToString()); 
                
                }
        }
        [HttpGet("GetReproduction")]

        public ActionResult<IEnumerable<ReproductionModel>> Getreproduction()
        {
            try
            {
                return Ok( _Services.GetReproduction());
            }
            catch (Exception ex)
            {
                    FunctionsGeneral.AddLog(ex.Message);
                    return StatusCode(500, ex.ToString());

            }
        }
        [HttpGet("ConsulReproduction")]
        public ActionResult<ReproductionModel> GetReproductionById(int Id_reproduction)
        {
            try
            { 
                    var reproduction = _Services.GetReproductionById(Id_reproduction);
                if (reproduction != null)
                {
                    return Ok(reproduction);
                }
                else
                {
                    return NotFound("Reproduction ot found");
                }
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
        [HttpPost("UpdateReproduction")]
        public IActionResult UpdateReproduction(ReproductionModel entity)
        {
            try
            {
<<<<<<< HEAD
                if (entity.Id_reproduction <= 0) 
=======
                if (entity.Id_reproduction <= 0) // Verifica que el ID sea válido
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
                {
                    return BadRequest("Invalid reproduction ID.");
                }

<<<<<<< HEAD
                
=======
                // Llamar al método de actualización en el servicio
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
                _Services.UpdateReproduction(entity.Id_reproduction, entity);

                return Ok("Reproduction updated successfully.");
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
        [HttpGet("GetReproductionInRange")]
        public ActionResult<IEnumerable<FoodModel>> GetCagesInRange(int startId, int endId)
        {
            try
            {
                var ReproductionModel = _Services.GetReproductionInRange(startId, endId);
                if (ReproductionModel == null || !ReproductionModel.Any())
                {
                    return NotFound("No Food found in the specified range.");
                }
                return Ok(ReproductionModel);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }

        }
        [HttpDelete("DeleteReproduction")]
        public IActionResult DeleteReproductionById(int Id_reproduction)
        {
            try
            {
                if (Id_reproduction <= 0)
                {
                    return BadRequest("Invalid reproduction ID.");
                }

                var result = _Services.DeleteById(Id_reproduction);

                if (result)
                {
                    return Ok("Reproduction deleted successfully.");
                }
                else
                {
                    return NotFound("Reproduction not found.");
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
