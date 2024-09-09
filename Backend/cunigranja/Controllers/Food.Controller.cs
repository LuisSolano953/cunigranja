using cunigranja.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("Api/[controller]")]
public class AlimentacionController : Controller
{
    [HttpPost("CreateAlimentacion")]
    public IActionResult Create(Alimentacion alimentacion)
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

    [HttpGet("GetAlimentacion")]
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

    [HttpPost("UpdateAlimentacion")]
    public IActionResult Update( Alimentacion alimentacion)
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

    [HttpDelete("DeleteAlimentacion")]
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
