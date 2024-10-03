using cunigranja.Functions;
using cunigranja.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

[ApiController]
[Route("Api/[controller]")]
public class FoodController : Controller
{
        public IConfiguration _configuration { get; set; }
        public GeneralFunctions FunctionsGeneral;
        public FoodController(IConfiguration configuration)
        {
            FunctionsGeneral = new GeneralFunctions(configuration);
            _configuration = configuration;
        }

    [HttpPost("CreateFood")]
    public IActionResult Create(FoodModel food)
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

    [HttpGet("GetFood")]
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

    [HttpPost("UpdateFood")]
    public IActionResult Update(  FoodModel food)
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

    [HttpDelete("DeleteFood")]
    public IActionResult Delete()
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
