using cunigranja.Functions;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Mvc;


namespace cunigranja.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class weighingController : Controller
    {
        public readonly WeighingServices _Services;
        public IConfiguration _configuration { get; set; }
        public GeneralFunctions FunctionsGeneral;
        public weighingController(IConfiguration configuration, WeighingServices weighingServices)
        {
            FunctionsGeneral = new GeneralFunctions(configuration);
            _configuration = configuration;
            _Services = weighingServices;
        }

        [HttpPost("CreateWeighing")]
        public IActionResult Create(WeighingModel entity)
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

        [HttpGet("GetWeighing")]
        public ActionResult<IEnumerable<WeighingModel>> Getweighing()
        {
            try
            {
                return Ok(_Services.GetWeighing());
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }


        [HttpGet("ConsulWeighing")]
        public ActionResult<WeighingModel> GetweighingById(int Id_weighing)
        {
            try
            {

                var weighing = _Services.GetWeighingById(Id_weighing);
                if (weighing != null)
                {
                    return Ok(weighing);
                }
                else
                {
                    return NotFound("Weighing ot found");
                }
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }

        }
        [HttpPost("UpdateWeighing")]
        public IActionResult UpdateWeighing(WeighingModel entity)
        {
            try
            {
                if (entity.Id_weighing <= 0) // Verifica que el ID sea válido
                {
                    return BadRequest("Invalid weighing ID.");
                }

                // Llamar al método de actualización en el servicio
                _Services.UpdateWeighing(entity.Id_weighing, entity);

                return Ok("Weighing updated successfully.");
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
        [HttpGet("GetWeighingInRange")]
        public ActionResult<IEnumerable<WeighingModel>> GetCagesInRange(int startId, int endId)
        {
            try
            {
                var weighingModels = _Services.GetCageInRange(startId, endId);
                if (weighingModels == null || !weighingModels.Any())
                {
                    return NotFound("No Food found in the specified range.");
                }
                return Ok(weighingModels);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
        [HttpDelete("DeleteWeighing")]
        public IActionResult DeleteWeighingById(int Id_weighing)
        {
            try
            {
                if (Id_weighing <= 0)
                {
                    return BadRequest("Invalid weighing ID.");
                }

                var result = _Services.DeleteById(Id_weighing);

                if (result)
                {
                    return Ok("Weighing deleted successfully.");
                }
                else
                {
                    return NotFound("Weighing not found.");
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
