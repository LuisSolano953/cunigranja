using cunigranja.DTOs;
using cunigranja.Functions;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Mvc;

namespace cunigranja.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class RabbitController : Controller
    {
        public readonly RabbitServices _Services;
        public readonly CageServices _cageServices;
        public IConfiguration _configuration { get; set; }
        public GeneralFunctions FunctionsGeneral;

        public RabbitController(IConfiguration configuration, RabbitServices RabbitServices, CageServices cageServices)
        {
            FunctionsGeneral = new GeneralFunctions(configuration);
            _configuration = configuration;
            _Services = RabbitServices;
            _cageServices = cageServices;
        }

        [HttpPost("CreateRabbit")]
        public IActionResult Create(RabbitModel entity)
        {
            try
            {
                // Verificar si la jaula tiene capacidad disponible
                if (!_cageServices.CheckCageCapacity(entity.Id_cage))
                {
                    int capacity = _cageServices.GetCageCapacity(entity.Id_cage);
                    int occupancy = _cageServices.GetCageOccupancy(entity.Id_cage);
                    return BadRequest(new
                    {
                        message = $"La jaula seleccionada está llena. Capacidad máxima: {capacity} conejos. Actualmente tiene {occupancy} conejos."
                    });
                }

                bool success = _Services.Add(entity);
                if (success)
                {
                    return Ok(new { message = "Conejo creado con éxito" });
                }
                else
                {
                    return BadRequest(new { message = "No se pudo crear el conejo. Verifica la capacidad de la jaula." });
                }
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpGet("GetRabbit")]
        public ActionResult<IEnumerable<RabbitDTO>> GetRabbit()
        {
            var rabbit = _Services.GetRabbit().Select(r => new RabbitDTO
            {
                Id_rabbit = r.Id_rabbit,
                name_rabbit = r.name_rabbit,
                fecha_registro = r.fecha_registro,
                peso_inicial = r.peso_inicial,
                sexo_rabbit = r.sexo_rabbit,
                estado = r.estado,
                peso_actual = r.peso_actual,
                nombre_race = r.racemodel.nombre_race,
                estado_cage = r.cagemodel.estado_cage,
                // Añadir los IDs de jaula y raza para que estén disponibles en el frontend
                Id_cage = r.Id_cage,
                Id_race = r.Id_race
            }).ToList();

            return Ok(rabbit);
        }

        [HttpGet("ConsultRabbit")]
        public ActionResult<RabbitModel> GetRabbitById(int id)
        {
            try
            {
                var Rabbit = _Services.GetRabbitById(id);
                if (Rabbit == null)
                {
                    return NotFound();
                }
                return Ok(Rabbit);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost("UpdateRabbit")]
        public IActionResult UpdateRabbit(RabbitModel entity)
        {
            try
            {
                if (entity.Id_rabbit <= 0) // Verifica que el ID sea válido
                {
                    return BadRequest("Invalid Rabbit ID.");
                }

                // Obtener el conejo actual para verificar si está cambiando de jaula
                var currentRabbit = _Services.GetRabbitById(entity.Id_rabbit);
                if (currentRabbit == null)
                {
                    return NotFound("Conejo no encontrado.");
                }

                // Si está cambiando de jaula, verificar capacidad
                if (currentRabbit.Id_cage != entity.Id_cage)
                {
                    if (!_cageServices.CheckCageCapacity(entity.Id_cage))
                    {
                        int capacity = _cageServices.GetCageCapacity(entity.Id_cage);
                        int occupancy = _cageServices.GetCageOccupancy(entity.Id_cage);
                        return BadRequest(new
                        {
                            message = $"La jaula seleccionada está llena. Capacidad máxima: {capacity} conejos. Actualmente tiene {occupancy} conejos."
                        });
                    }
                }

                // Llamar al método de actualización en el servicio
                bool success = _Services.UpdateRabbit(entity.Id_rabbit, entity);

                if (success)
                {
                    return Ok(new { message = "Conejo actualizado correctamente. Se ha recalculado el peso actual." });
                }
                else
                {
                    return BadRequest(new { message = "No se pudo actualizar el conejo. Verifica la capacidad de la jaula." });
                }
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpGet("GetRabbitsInRange")]
        public ActionResult<IEnumerable<RabbitModel>> GetRabbitInRange(int startId, int endId)
        {
            try
            {
                var Rabbit = _Services.GetRabbitInRange(startId, endId);
                if (Rabbit == null || !Rabbit.Any())
                {
                    return NotFound("No Rabbit found in the specified range.");
                }
                return Ok(Rabbit);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpDelete("DeleteRabbit")]
        public IActionResult DeleteRabbitById(int id)
        {
            try
            {
                var existingRabbit = _Services.GetRabbitById(id);
                if (existingRabbit == null)
                {
                    return NotFound();
                }
                _Services.Delete(id);
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