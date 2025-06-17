using cunigranja.Functions;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace cunigranja.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class RaceController : Controller
    {
        public readonly RaceServices _raceServices;
        public IConfiguration _configuration { get; set; }
        public GeneralFunctions FunctionsGeneral;

        public RaceController(IConfiguration configuration, RaceServices raceServices)
        {
            FunctionsGeneral = new GeneralFunctions(configuration);
            _configuration = configuration;
            _raceServices = raceServices;
        }

        [HttpPost("CreateRace")]
        public IActionResult Create(RaceModel entity)
        {
            try
            {
                _raceServices.Add(entity);
                return Ok(new { message = "raza creado con extito" });
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpGet("GetRace")]
        public ActionResult<IEnumerable<RaceModel>> GetRace()
        {
            try
            {
                return Ok(_raceServices.GetRace());
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpGet("ConsulRace")]
        public ActionResult<RaceModel> GetRaceById(int Id_race)
        {
            try
            {

                var race = _raceServices.GetRaceById(Id_race);
                if (race != null)
                {
                    return Ok(race);
                }
                else
                {
                    return NotFound("Race not found.");
                }

            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost("UpdateRace")]
        public IActionResult UpdateRace(RaceModel entity)
        {
            try
            {
                if (entity.Id_race <= 0) 
                {
                    return BadRequest("Invalid Race ID.");
                }

                
                _raceServices.UpdateRace(entity.Id_race, entity);
                return Ok("Race updated successfully.");
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpGet("GetRaceInRange")]
        public ActionResult<IEnumerable<RaceModel>> GetRaceInRange(int startId, int endId)
        {
            try
            {
                var raceModels = _raceServices.GetRaceInRange(startId, endId);
                if (raceModels == null || !raceModels.Any())
                {
                    return NotFound("No Race in the specified range.");
                }
                return Ok(raceModels);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpDelete("DeleteRace")]
        public IActionResult DeleteRaceById(int Id_race)
        {
            try
            {
                if (Id_race <= 0)
                {
                    return BadRequest("Invalid Race ID.");
                }

                var result = _raceServices.DeleteById(Id_race);

                if (result)
                {
                    return Ok("Race deleted successfully.");
                }
                else
                {
                    return NotFound("Race not found.");
                }
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500);

            }
        }
    }
}
