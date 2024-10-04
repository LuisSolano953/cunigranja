using cunigranja.Functions;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace cunigranja.Controllers
{
        [ApiController]
        [Route("Api/[controller]")]
        public class ResponsibleController : Controller
        {
            public readonly ResponsibleServices _Services;
            public IConfiguration _configuration { get; set; }
            public GeneralFunctions FunctionsGeneral;
            public ResponsibleController(IConfiguration configuration, ResponsibleServices responsibleServices)
            {
                FunctionsGeneral = new GeneralFunctions(configuration);
                _configuration = configuration;
            _Services = responsibleServices;
        }

        [HttpPost("CreateResponsible")]
            public IActionResult create(ResponsibleModel entity)

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
            [HttpGet("GetResponsible")]

        public ActionResult<IEnumerable<ResponsibleModel>> Getresponsible()
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
        
    

