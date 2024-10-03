using cunigranja.Functions;
using cunigranja.Models;
using Microsoft.AspNetCore.Mvc;

namespace cunigranja.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class CageController : Controller
    {
        [HttpPost("CreateCage")]
        public IActionResult create(CageModel Cage)

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
        [HttpGet("GetCage")]

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

       [HttpPost("UpdateCage")]
        public IActionResult Update(int Id,CageModel Cage)
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
        [HttpDelete("DeleteCage")]
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
