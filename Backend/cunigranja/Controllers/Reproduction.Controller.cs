using cunigranja.Functions;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Mvc;

namespace cunigranja.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class ReproductionController : Controller
    {
        public readonly ReproductionServices _Services;
        public IConfiguration _configuration { get; set; }
        public GeneralFunctions FunctionsGeneral;
        public ReproductionController(IConfiguration configuration, ReproductionServices reproductionServices)
        {
            FunctionsGeneral = new GeneralFunctions(configuration);
            _configuration = configuration;
            _Services = reproductionServices;
        }
        [HttpPost("CreateReproduction")]
        public IActionResult create(ReproductionModel entity)

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
        [HttpGet("GetReproduction")]

        public ActionResult<IEnumerable<ReproductionModel>> Getreproduction()
        {
            try
            {
                return Ok( _Services.GetReproduction());
            }
            catch (Exception ex)
            {
                    FunctionsGeneral.AddLog(ex.Message);
                    return StatusCode(500, ex.ToString());

            }
        }
        [HttpPost("UpdateReproduction")]
        public IActionResult Update(ReproductionModel Reproductcion)
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
        [HttpDelete("DeleteReproduction")]
        public IActionResult Delete(int Id)
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
    }
}
