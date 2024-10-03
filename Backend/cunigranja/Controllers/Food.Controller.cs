using cunigranja.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("Api/[controller]")]
public class FoodController : Controller
{
    [HttpPost("CreateFood")]
    public IActionResult Create(FoodModel food)
    {
        try
        {
            // Lógica para crear un registro de alimentación
            return Ok("Alimentación creada exitosamente");
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.ToString());
        }
    }

    [HttpGet("GetFood")]
    public IActionResult Get(int id)
    {
        try
        {
            // Lógica para obtener un registro de alimentación por id
            return Ok("Detalles de la alimentación recuperados exitosamente");
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.ToString());
        }
    }

    [HttpPost("UpdateFood")]
    public IActionResult Update(  FoodModel food)
    {
        try
        {
            // Lógica para actualizar un registro de alimentación
            return Ok("Alimentación actualizada exitosamente");
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.ToString());
        }
    }

    [HttpDelete("DeleteFood")]
    public IActionResult Delete()
    {
        try
        {
            // Lógica para eliminar un registro de alimentación
            return Ok("Alimentación eliminada exitosamente");
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.ToString());
        }
    }
}
