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
        [HttpPost("UpdateFood")]
        public IActionResult UpdateFood(FoodModel entity)
        {
            try
            {
                if (entity.Id_food <= 0) // Verifica que el ID sea válido
                {
                    return BadRequest("Invalid Food ID.");
                }

                _Services.Update(entity);
                return Ok("Food updated successfully.");
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
