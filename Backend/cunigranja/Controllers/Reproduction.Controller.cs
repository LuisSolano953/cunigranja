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
                return Ok();
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
        [HttpPost("UpdateReproduction")]
        public IActionResult UpdateReproduction(ReproductionModel entity)
        {
            try
            {
                if (entity.Id_reproduction <= 0) // Verifica que el ID sea válido
                {
                    return BadRequest("Invalid reproduction ID.");
                }

                _Services.Update(entity);
                return Ok("Reproduction updated successfully.");
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
