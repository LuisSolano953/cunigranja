using cunigranja.DTOs;
using cunigranja.Functions;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Mvc;

namespace cunigranja.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class weighingController : Controller
    {
        public readonly WeighingServices _Services;
        public IConfiguration _configuration { get; set; }
        public GeneralFunctions FunctionsGeneral;

        public weighingController(IConfiguration configuration, WeighingServices weighingServices)
        {
            FunctionsGeneral = new GeneralFunctions(configuration);
            _configuration = configuration;
            _Services = weighingServices;
        }

        [HttpPost("CreateWeighing")]
        public IActionResult Create(WeighingModel entity)
        {
            try
            {
                _Services.Add(entity);
                return Ok(new { message = "creado con extito" });
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpGet("GetWeighing")]
        public ActionResult<IEnumerable<WeighingDTO>> GetAllWeighing()
        {
            var weighing = _Services.GetAll().Select(w => new WeighingDTO
            {
                Id_weighing = w.Id_weighing,
                fecha_weighing = w.fecha_weighing,
                ganancia_peso = w.ganancia_peso,
                peso_actual = w.peso_actual,
                name_user = w.user.name_user,
                Id_user = w.user.Id_user,
                name_rabbit = w.rabbitmodel.name_rabbit,
                Id_rabbit = w.rabbitmodel.Id_rabbit,
            }).ToList();

            return Ok(weighing);
        }

        [HttpGet("GetWeighingByRabbit")]
        public ActionResult<IEnumerable<WeighingModel>> GetWeighingByRabbit(int id_rabbit)
        {
            try
            {
                var weighings = _Services.GetWeighingByRabbitId(id_rabbit);
                if (weighings == null || !weighings.Any())
                {
                    return NotFound("No se encontraron pesajes para este conejo.");
                }
                return Ok(weighings);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        // ✅ NUEVO ENDPOINT - Usando WeighingModel existente
        [HttpPost("RecalculateRabbitWeight")]
        public IActionResult RecalculateRabbitWeight([FromBody] WeighingModel request)
        {
            try
            {
                // Usar Id_rabbit y peso_actual del modelo WeighingModel
                // Id_rabbit = ID del conejo
                // peso_actual = nuevo peso inicial
                if (request == null || request.Id_rabbit <= 0)
                {
                    return BadRequest("ID de conejo inválido");
                }

                // Llamar al método existente en el servicio
                _Services.RecalculateRabbitCurrentWeight(request.Id_rabbit, request.peso_actual);

                return Ok(new
                {
                    message = "Peso recalculado correctamente",
                    rabbitId = request.Id_rabbit,
                    newPesoInicial = request.peso_actual
                });
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, new { message = "Error al recalcular el peso", error = ex.Message });
            }
        }

        [HttpGet("ConsulWeighing")]
        public ActionResult<WeighingModel> GetweighingById(int Id_weighing)
        {
            try
            {
                var weighing = _Services.GetWeighingById(Id_weighing);
                if (weighing != null)
                {
                    return Ok(weighing);
                }
                else
                {
                    return NotFound("Weighing ot found");
                }
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost("UpdateWeighing")]
        public IActionResult UpdateWeighing(WeighingModel entity)
        {
            try
            {
                if (entity.Id_weighing <= 0)
                {
                    return BadRequest("Invalid weighing ID.");
                }

                _Services.UpdateWeighing(entity.Id_weighing, entity);
                return Ok("Weighing updated successfully.");
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpGet("GetWeighingInRange")]
        public ActionResult<IEnumerable<WeighingModel>> GetCagesInRange(int startId, int endId)
        {
            try
            {
                var weighingModels = _Services.GetCageInRange(startId, endId);
                if (weighingModels == null || !weighingModels.Any())
                {
                    return NotFound("No Food found in the specified range.");
                }
                return Ok(weighingModels);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpDelete("DeleteWeighing")]
        public IActionResult DeleteWeighingById(int Id_weighing)
        {
            try
            {
                if (Id_weighing <= 0)
                {
                    return BadRequest("Invalid weighing ID.");
                }

                var result = _Services.DeleteById(Id_weighing);

                if (result)
                {
                    return Ok("Weighing deleted successfully.");
                }
                else
                {
                    return NotFound("Weighing not found.");
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
