using cunigranja.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("Api/[controller]")]
public class healthcontroller : Controller
{
    [HttpPost("Createhealth")]
    public IActionResult Create(healthModel sanidad)
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

    [HttpGet("GetSanidad")]
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

    [HttpPost("UpdateSanidad")]
    public IActionResult Update(SanidadModel sanidadModel)
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

    [HttpDelete("DeleteSanidad")]
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

