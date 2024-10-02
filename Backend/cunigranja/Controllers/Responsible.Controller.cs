using cunigranja.Functions;
using cunigranja.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace cunigranja.Controllers
{
        [ApiController]
        [Route("Api/[controller]")]
        public class ResponsibleController : Controller
        {
            [HttpPost("CreateResponsible")]
            public IActionResult create(ResponsibleModel Resposible)

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
            [HttpGet("GetResponsible")]

            public IActionResult Get(int Id)
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

        [HttpGet("GetsAlLResposible")]
        public IActionResult GetsAllResponsible(int id, GeneralFuctions generalFuctions)
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

        [HttpPut("UpdateResponsible")]
            public IActionResult Update(int Id, ResponsibleModel Responsible)
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
            [HttpDelete("DeleteResponsible")]
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
        
    

