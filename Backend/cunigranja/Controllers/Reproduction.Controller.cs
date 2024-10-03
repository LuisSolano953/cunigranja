using cunigranja.Models;
using Microsoft.AspNetCore.Mvc;

namespace cunigranja.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class ReproductionController : Controller
    {
        [HttpPost("CreateReproduction")]
        public IActionResult create(ReproductionModel Reproduction)

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
        [HttpGet("GetReproduction")]

        public  IActionResult Get (int Id)
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
        [HttpPost("UpdateReproduction")]
        public IActionResult Update(ReproductionModel Reproductcion)
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
