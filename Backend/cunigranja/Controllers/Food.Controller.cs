using cunigranja.Functions;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

[ApiController]
[Route("Api/[controller]")]
public class FoodController : Controller
{
        public readonly FoodServices _Services;
        public IConfiguration _configuration { get; set; }
        public GeneralFunctions FunctionsGeneral;
        public FoodController(IConfiguration configuration, FoodServices foodServices)
        {
            FunctionsGeneral = new GeneralFunctions(configuration);
            _configuration = configuration;
        _Services = foodServices;
    }

    [HttpPost("CreateFood")]
    public IActionResult Create(FoodModel entity)
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

        [HttpGet("GetFood")]
       public ActionResult<IEnumerable<FoodModel>> GetFood()
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
