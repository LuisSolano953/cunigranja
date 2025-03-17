using cunigranja.DTOs;
using cunigranja.Functions;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Mvc;

namespace cunigranja.Controllers
{
    
        [ApiController]
        [Route("Api/[controller]")]
        public class RabiController : Controller
        {
            public readonly RabiServices _Services;
            public IConfiguration _configuration { get; set; }
            public GeneralFunctions FunctionsGeneral;

             public RabiController(IConfiguration configuration, RabiServices rabiServices)
            {
                FunctionsGeneral = new GeneralFunctions(configuration);
                _configuration = configuration;
                _Services = rabiServices;
            }

            [HttpPost("Create Rabi")]
            public IActionResult Create( RabiModel entity)
            {
                try
                {
                    _Services.Add(entity);
                    return Ok(new { message = "jaula creado con extito" });
                }
                catch (Exception ex)
                {
                    FunctionsGeneral.AddLog(ex.Message);
                    return StatusCode(500, ex.ToString());
                }
            }

            [HttpGet("Get Rabi")]
            public ActionResult<IEnumerable< RabiDTO>> GetAllsRabi()
            {
            var rabi = _Services.GetAll().Select(c => new RabiDTO
            {
                Id_rabi =c.Id_rabi,
                fecha_salida = c.fecha_salida,
                ganancia_peso=c.ganancia_peso,
                nombre_rabi=c.nombre_rabi,
                peso_inicial=c.peso_inicial,
                sexo_rabi=c.sexo_rabi,
                estado=c.estado,
                name_race=c.racemodel.nombre_race,
                estado_cage=c.cagemodel.estado_cage,
                
            }).ToList();

            return Ok(rabi);
        }

            [HttpGet("Consult Rabi")]
            public ActionResult< RabiModel> GetRabiById(int id)
            {
                try
                {
                    var rabi = _Services.GetRabiById(id);
                    if (rabi == null)
                    {
                        return NotFound();
                    }
                    return Ok( rabi);
                }
                catch (Exception ex)
                {
                    FunctionsGeneral.AddLog(ex.Message);
                    return StatusCode(500, ex.ToString());
                }
            }

            [HttpPost("Update Rabi")]
            public IActionResult UpdateRabi( RabiModel entity)
            {
                try
                {
                    if (entity.Id_rabi <= 0) // Verifica que el ID sea válido
                    {
                        return BadRequest("Invalid  Rabi ID.");
                    }

                    // Llamar al método de actualización en el servicio
                    _Services.UpdateRabi(entity.Id_rabi, entity);

                    return Ok("Rabi updated successfully.");
                }
                catch (Exception ex)
                {
                    FunctionsGeneral.AddLog(ex.Message);
                    return StatusCode(500, ex.ToString());
                }
            }
            [HttpGet("GetRabisInRange")]
            public ActionResult<IEnumerable<RabiModel>> GetRabiInRange(int startId, int endId)
            {
                try
                {
                    var rabi = _Services.GetRabiInRange(startId, endId);
                    if (rabi == null || !rabi.Any())
                    {
                        return NotFound("No Rabi found in the specified range.");
                    }
                    return Ok(rabi);
                }
                catch (Exception ex)
                {
                    FunctionsGeneral.AddLog(ex.Message);
                    return StatusCode(500, ex.ToString());
                }
            }

            [HttpDelete("DeleteRabi")]
            public IActionResult DeleteRabiById(int id)
            {
                try
                {
                    var existingRabi = _Services.GetRabiById(id);
                    if (existingRabi == null)
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
