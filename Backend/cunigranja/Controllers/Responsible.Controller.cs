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
                return Ok(_Services.GetResponsible());
                }
                catch (Exception ex)
                {
                    FunctionsGeneral.AddLog(ex.Message);
                    return StatusCode(500, ex.ToString());

                }
            }



        [HttpGet("ConsulResponsible")]
        public ActionResult<ResponsibleModel> GetResponsibleById(int Id_Responsible)
        {
            var responsible = _Services.GetResponsibleById(Id_Responsible);
            if (responsible != null)
            {
                return Ok(responsible);
            }
            else
            {
                return NotFound("Responsible ot found");
            }
        }
        [HttpPost("UpdateResponsible")]
        public IActionResult UpdateResponsible(ResponsibleModel entity)
        {
            try
            {
                if (entity.Id_responsible <= 0) // Verifica que el ID sea válido
                {
                    return BadRequest("Invalid responsible ID.");
                }

                // Llamar al método de actualización en el servicio
                _Services.UpdateResponsible(entity.Id_responsible, entity);

                return Ok("Responsible updated successfully.");
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
        [HttpGet("GetResponsibleInRange")]
        public ActionResult<IEnumerable<ResponsibleModel>> GetResponsibleInRange(int startId, int endId)
        {
            try
            {
                var ResponsibleModel = _Services.GetResponsibleModelInRange(startId, endId);
                if (ResponsibleModel == null || !ResponsibleModel.Any())
                {
                    return NotFound("No Food found in the specified range.");
                }
                return Ok(ResponsibleModel);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }

        }

        [HttpDelete("DeleteResponsible")]
        public IActionResult DeleteResponsibleById(int Id_responsible)
        {
            try
            {
                if (Id_responsible <= 0)
                {
                    return BadRequest("Invalid responsible ID.");
                }

                var result = _Services.DeleteById(Id_responsible);

                if (result)
                {
                    return Ok("Responsible deleted successfully.");
                }
                else
                {
                    return NotFound("Responsible not found.");
                }
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
    }
}
        
    

