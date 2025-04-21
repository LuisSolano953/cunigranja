using cunigranja.DTOs;
using cunigranja.Functions;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Mvc;

namespace cunigranja.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class MountsController : Controller
    {
        
            public readonly MountsServices _Services;
            public IConfiguration _configuration { get; set; }
            public GeneralFunctions FunctionsGeneral;

            public MountsController(IConfiguration configuration, MountsServices mountsServices)
            {
                FunctionsGeneral = new GeneralFunctions(configuration);
                _configuration = configuration;
                _Services = mountsServices;
            }

            [HttpPost("CreateMounts")]
            public IActionResult Create(MountsModel entity)
            {
                try
                {
                    _Services.Add(entity);
                    return Ok(new { message = "Monta creado con extito" });
                }
                catch (Exception ex)
                {
                    FunctionsGeneral.AddLog(ex.Message);
                    return StatusCode(500, ex.ToString());
                }
            }

            [HttpGet("GetMounts")]
            public ActionResult<IEnumerable<MountsModel>> GetsAllMounts()
            {

            var mounts = _Services.GetAll().Select(m => new MountsDTO

            {
                Id_mounts= m.Id_mounts,
                tiempo_mounts=m.tiempo_mounts,
                fecha_mounts=m.fecha_mounts,
                cantidad_mounts=m.cantidad_mounts,
                name_rabbit=m.rabbitmodel?.name_rabbit ?? "Sin nombre"

            }).ToList();

            return Ok(mounts);
        }

            [HttpGet("ConsultMounts")]
            public ActionResult<MountsModel> GetMountsById(int id)
            {
                try
                {
                    var cage = _Services.GetMountsById(id);
                    if (cage == null)
                    {
                        return NotFound();
                    }
                    return Ok(cage);
                }
                catch (Exception ex)
                {
                    FunctionsGeneral.AddLog(ex.Message);
                    return StatusCode(500, ex.ToString());
                }
            }

            [HttpPost("UpdateCage")]
            public IActionResult UpdateMounts(MountsModel entity)
            {
                try
                {
                    if (entity.Id_mounts <= 0) // Verifica que el ID sea válido
                    {
                        return BadRequest("Invalid Cage ID.");
                    }

                    // Llamar al método de actualización en el servicio
                    _Services.UpdateMounts(entity.Id_mounts, entity);

                    return Ok("Monta actualizada correctamente.");
                }
                catch (Exception ex)
                {
                    FunctionsGeneral.AddLog(ex.Message);
                    return StatusCode(500, ex.ToString());
                }
            }
            [HttpGet("GetMountsInRange")]
            public ActionResult<IEnumerable<MountsModel>> GetMountsInRange(int startId, int endId)
            {
                try
                {
                    var mounts = _Services.GetMountsInRange(startId, endId);
                    if (mounts == null || !mounts.Any())
                    {
                        return NotFound("No Mounts found in the specified range.");
                    }
                    return Ok(mounts);
                }
                catch (Exception ex)
                {
                    FunctionsGeneral.AddLog(ex.Message);
                    return StatusCode(500, ex.ToString());
                }
            }

            [HttpDelete("DeleteMounts")]
            public IActionResult DeleteMountsById(int id)
            {
                try
                {
                    var existingMounts = _Services.GetMountsById(id);
                    if (existingMounts == null)
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
