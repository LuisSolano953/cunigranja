using cunigranja.Models;
using cunigranja.Functions;
using Microsoft.AspNetCore.Mvc;
using cunigranja.Services;

[ApiController]
[Route("Api/[controller]")]
    public class HealthController : Controller
{
    public readonly HealthServices _Services;
    public IConfiguration _configuration { get; set; }
    public GeneralFunctions FunctionsGeneral;
    public HealthController(IConfiguration configuration, HealthServices healthServices)
    {
        FunctionsGeneral = new GeneralFunctions(configuration);
        _configuration = configuration;
        _Services = healthServices;

    }
    [HttpPost("Createhealth")]
    public IActionResult Create(HealthModel entity)
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

        [HttpGet("GetHealth")]
          public ActionResult<IEnumerable<HealthModel>> Gethealth()
            {
                try
                {
                    return Ok(_Services.GetHealth());
                 }
                catch (Exception ex)
                {
                    FunctionsGeneral.AddLog(ex.Message);
                    return StatusCode(500, ex.ToString());
                }
            }

        [HttpPost("UpdateHealth")]
        public IActionResult Update(HealthModel HealthModel)
        {
            try
            {

            return Ok();
        }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpDelete("DeleteHealth")]
        public IActionResult Delete(int id)
        {
            try
            {
            return Ok();
        }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
}

