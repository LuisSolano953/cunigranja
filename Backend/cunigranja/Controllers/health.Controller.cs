using cunigranja.Models;
using cunigranja.Functions;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("Api/[controller]")]
    public class HealthController : Controller
{
    public IConfiguration _configuration { get; set; }
    public GeneralFunctions FunctionsGeneral;
    public HealthController(IConfiguration configuration)
    {
        FunctionsGeneral = new GeneralFunctions(configuration);
        _configuration = configuration;
       
    }
    [HttpPost("Createhealth")]
    public IActionResult Create(HealthModel sanidad)
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

        [HttpGet("GetHealth")]
        public IActionResult Get(int id)
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

