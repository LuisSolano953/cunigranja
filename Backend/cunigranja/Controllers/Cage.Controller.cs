using cunigranja.Functions;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Mvc;

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
            public IActionResult create(CageModel entity)

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

       [HttpPost("UpdateCage")]
            public IActionResult Update(int Id,CageModel Cage)
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
        [HttpDelete("DeleteCage")]
            public IActionResult Delete(int Id)
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
}
