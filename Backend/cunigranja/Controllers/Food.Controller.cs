using cunigranja.Functions;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace cunigranja.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class FoodController : Controller
    {
        public readonly FoodServices _Services;
        public IConfiguration _configuration { get; set; }
        public GeneralFunctions FunctionsGeneral;
        public FoodController(IConfiguration configuration, FoodServices foodServices)
        {
            FunctionsGeneral = new GeneralFunctions(configuration);
            _configuration = configuration;
            _Services = foodServices;
        }

        [HttpPost("CreateFood")]
        public IActionResult Create(FoodModel entity)
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

        [HttpGet("GetFood")]
        public ActionResult<IEnumerable<FoodModel>> Getfood()
        {
            try
            {
                return Ok(_Services.GetFood());
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }


        [HttpGet("ConsulFood")]
        public ActionResult<FoodModel> GetFoodById(int Id_food)
        {
            try
            {
                var food = _Services.GetFoodById(Id_food);
                if (food != null)
                {
                    return Ok(food);
                }
                else
                {
                    return NotFound("Food ot found");
                }

            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
        [HttpPost("UpdateFood")]
        public IActionResult UpdateFood(FoodModel entity)
        {
            try
            {
                if (entity.Id_food <= 0) // Verifica que el ID sea válido
                {
                    return BadRequest("Invalid food ID.");
                }

                // Llamar al método de actualización en el servicio
                _Services.UpdateFood(entity.Id_food, entity);

                return Ok("Food updated successfully.");
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
        [HttpGet("GetFoodInRange")]
        public ActionResult<IEnumerable<FoodModel>> GetCagesInRange(int startId, int endId)
        {
            try
            {
                var foodModels = _Services.GetCageInRange(startId, endId);
                if (foodModels == null || !foodModels.Any())
                {
                    return NotFound("No Food found in the specified range.");
                }
                return Ok(foodModels);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
        [HttpDelete("DeleteFood")]
        public IActionResult DeleteFoodById(int Id_food)
        {
            try
            {
                if (Id_food <= 0)
                {
                    return BadRequest("Invalid food ID.");
                }

                var result = _Services.DeleteById(Id_food);

                if (result)
                {
                    return Ok("Food deleted successfully.");
                }
                else
                {
                    return NotFound("Food not found.");
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
