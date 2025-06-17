using cunigranja.DTOs;
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

        public ActionResult<IEnumerable<ReproductionDTO>> GetsAllReproduction()
        {

            var reproduction = _Services.GetAll().Select(e => new ReproductionDTO
            {
                Id_reproduction = e.Id_reproduction,            
                fecha_nacimiento= e.fecha_nacimiento,
                total_conejos=e.total_conejos,
                nacidos_muertos=e.nacidos_muertos,
                nacidos_vivos=  e.nacidos_vivos,
                Id_rabbit = e.rabbitmodel.Id_rabbit,
                name_rabbit =e.rabbitmodel.name_rabbit,
            }).ToList();

            return Ok(reproduction);


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
                if (entity.Id_reproduction <= 0) 
                {
                    return BadRequest("Invalid reproduction ID.");
                }

                
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
        public IActionResult DeleteReproductionById(int Id)
        {
            try
            {
                var existingReproduction = _Services.GetReproductionById(Id);
                if (existingReproduction == null)
                {
                    return NotFound();
                }
                _Services.DeleteById(Id);
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
