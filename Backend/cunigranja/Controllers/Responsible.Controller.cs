using cunigranja.Functions;
using cunigranja.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace cunigranja.Controllers
{
        [ApiController]
        [Route("Api/[controller]")]
        public class ResponsibleController : Controller
        {
            public IConfiguration _configuration { get; set; }
            public GeneralFunctions FunctionsGeneral;
            public ResponsibleController(IConfiguration configuration)
            {
                FunctionsGeneral = new GeneralFunctions(configuration);
                _configuration = configuration;
            }

        [HttpPost("CreateResponsible")]
            public IActionResult create(ResponsibleModel Resposible)

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
            [HttpGet("GetResponsible")]

            public IActionResult Get(int Id)
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

        

        [HttpPost("UpdateResponsible")]
            public IActionResult Update(int Id, ResponsibleModel Responsible)
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
            [HttpDelete("DeleteResponsible")]
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
        
    

