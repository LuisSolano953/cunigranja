using cunigranja.Models;
using Microsoft.AspNetCore.Mvc;

namespace cunigranja.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class ReproducionController : Controller
    {
        [HttpPost("CreateReproduction")]
        public IActionResult create(ReproduccionModel Reproducion)

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
        [HttpPut("UpdateReproduction")]
        public IActionResult Update(ReproduccionModel Reproduccion)
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
