using cunigranja.Functions;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace cunigranja.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class CageController : Controller
    {
        public readonly CageServices _Services;
        public IConfiguration _configuration { get; set; }
        public GeneralFunctions FunctionsGeneral;

        public CageController(IConfiguration configuration, CageServices cageServices)
        {
            FunctionsGeneral = new GeneralFunctions(configuration);
            _configuration = configuration;
            _Services = cageServices;
        }

        [HttpPost("CreateCage")]
        public IActionResult Create(CageModel entity)
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

        [HttpGet("GetCage")]
        public ActionResult<IEnumerable<CageModel>> GetCage()
        {
            try
            {
                return Ok(_Services.GetCage());
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpGet("ConsultCage")]
        public ActionResult<CageModel> GetCageById(int id)
        {
            try
            {
                var cage = _Services.GetCageById(id);
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
        public IActionResult UpdateCage(CageModel entity)
        {
            try
            {
                if (entity.Id_cage <= 0) // Verifica que el ID sea válido
                {
                    return BadRequest("Invalid Cage ID.");
                }

                // Llamar al método de actualización en el servicio
                _Services.UpdateCage(entity.Id_cage, entity);

                return Ok("Health updated successfully.");
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
        [HttpGet("GetCagesInRange")]
        public ActionResult<IEnumerable<CageModel>> GetCagesInRange(int startId, int endId)
        {
            try
            {
                var cages = _Services.GetCageInRange(startId, endId);
                if (cages == null || !cages.Any())
                {
                    return NotFound("No cage found in the specified range.");
                }
                return Ok(cages);
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
                var existingCage = _Services.GetCageById(id);
                if (existingCage == null)
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
