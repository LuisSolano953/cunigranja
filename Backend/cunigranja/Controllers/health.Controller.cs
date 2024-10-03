using cunigranja.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("Api/[controller]")]
public class healthcontroller : Controller
{
    [HttpPost("Createhealth")]
    public IActionResult Create(HealthModel sanidad)
    {
        try
        {
            // Lógica para crear un registro de sanidad
            return Ok("health created successfully");
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.ToString());
        }
    }

    [HttpGet("GetHealth")]
    public IActionResult Get(int id)
    {
        try
        {
            // Lógica para obtener un registro de sanidad por id
            return Ok("Sanidad details retrieved successfully");
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.ToString());
        }
    }

    [HttpPost("UpdateHealth")]
    public IActionResult Update(HealthModel HealthModel)
    {
        try
        {
            // Lógica para actualizar un registro de sanidad
            return Ok("Sanidad updated successfully");
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.ToString());
        }
    }

    [HttpDelete("DeleteHealth")]
    public IActionResult Delete(int id)
    {
        try
        {
            // Lógica para eliminar un registro de sanidad
            return Ok("Sanidad deleted successfully");
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.ToString());
        }
    }
}

