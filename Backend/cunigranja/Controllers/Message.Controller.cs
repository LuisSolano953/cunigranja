using Microsoft.AspNetCore.Mvc;

namespace Cunigrana.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MensajeController : Controller
    {
        [HttpPost]
        public IActionResult Saludar([FromBody] NombreRequest request)
        {
            var saludo = GenerarSaludo(request.Nombre);
            return Ok(new { Mensaje = saludo });
        }

        private string GenerarSaludo(string nombre)
        {
            return $"Hola, {nombre}! Bienvenido a nuestra API.";
        }
    }

    public class NombreRequest
    {
        public string Nombre { get; set; }
    }
}
