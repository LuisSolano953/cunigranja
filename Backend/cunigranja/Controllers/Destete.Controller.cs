using cunigranja.DTOs;
using cunigranja.Functions;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Mvc;

namespace cunigranja.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class DesteteController : Controller
    {
        public readonly DesteteServices _Services;
        public IConfiguration _configuration { get; set; }
        public GeneralFunctions FunctionsGeneral;

        public DesteteController(IConfiguration configuration, DesteteServices desteteServices)
        {
            FunctionsGeneral = new GeneralFunctions(configuration);
            _configuration = configuration;
            _Services = desteteServices;
        }

        [HttpPost("CreateDestete")]
        public IActionResult Create(DesteteModel entity)
        {
            try
            {
                _Services.Add(entity);
                return Ok(new { message = "Destete creado con extito" });
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpGet("GetDestete")]
        public ActionResult<IEnumerable<DesteteDTO>> GetAllsDestete()
        {

            var destete = _Services.GetAll().Select(d => new DesteteDTO
            {
                Id_destete = d.Id_destete,
                fecha_destete = d.fecha_destete,
                peso_destete = d.peso_destete,
                name_rabbit = d.rabbitmodel.name_rabbit,

            }).ToList();

            return Ok(destete);
        }

        [HttpGet("ConsultDestete")]
        public ActionResult<DesteteModel> GetDesteteById(int id)
        {
            try
            {
                var destete = _Services.GetDesteteById(id);
                if (destete == null)
                {
                    return NotFound();
                }
                return Ok(destete);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost("UpdateDestete")]
        public IActionResult UpdateDestete(DesteteModel entity)
        {
            try
            {
                if (entity.Id_destete <= 0) // Verifica que el ID sea válido
                {
                    return BadRequest("Invalid Destete ID.");
                }

                // Llamar al método de actualización en el servicio
                _Services.UpdateDestete(entity.Id_destete, entity);

                return Ok("Destete updated successfully.");
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
        [HttpGet("GetDesteteInRange")]
        public ActionResult<IEnumerable<DesteteModel>> GetDesteteInRange(int startId, int endId)
        {
            try
            {
                var destete = _Services.GetDesteteInRange(startId, endId);
                if (destete == null || !destete.Any())
                {
                    return NotFound("No Destete found in the specified range.");
                }
                return Ok(destete);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpDelete("DeleteDestete")]
        public IActionResult DeleteDesteteById(int id)
        {
            try
            {
                var existingDestete = _Services.GetDesteteById(id);
                if (existingDestete == null)
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
