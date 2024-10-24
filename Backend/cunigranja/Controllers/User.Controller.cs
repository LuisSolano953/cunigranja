using cunigranja.Functions;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace cunigranja.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    public class UserController : Controller
    {
        public readonly UserServices _Services;
        public IConfiguration _configuration { get; set; }
        public JwtModel JWT;
        public GeneralFunctions FunctionsGeneral;
        public UserController(IConfiguration configuration, UserServices userservices)
        {
            FunctionsGeneral = new GeneralFunctions(configuration);
            _Services = userservices;
            _configuration = configuration;
            JWT = _configuration.GetSection("JWT").Get<JwtModel>();
        }

        // POST: LoginController/Create
        [HttpPost("Login")]
        public IActionResult Login(LoginUser login)
        {
            try
            {
                // Obtener el usuario por correo electrónico
                var user = _Services.GetUsers().FirstOrDefault(u => u.email_user == login.Email);

                // Verificar si el usuario existe y la contraseña es correcta
                if (user == null || !BCrypt.Net.BCrypt.Verify(login.Passaword + user.intentos_user, user.password_user))
                {
                    return Unauthorized("Credenciales incorrectas.");
                }

                // Generar el token JWT
                var key = Encoding.UTF8.GetBytes(JWT.KeySecret);
                var claims = new ClaimsIdentity(new[]
                {
            new Claim("User", login.Email)
        });

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = claims,
                    Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(JWT.JwtExpiretime)),
                    SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(key),
                        SecurityAlgorithms.HmacSha256Signature)
                };

                var token = new JwtSecurityTokenHandler().CreateToken(tokenDescriptor);
                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

                // Guardar el token en la base de datos
                user.token_user = tokenString;
                _Services.UpdateUser(user.Id_user, user);

                // Devolver el token generado
                return Ok(new { token = tokenString });
            }
            catch (Exception ex)
            {
                // Registrar el error y devolver una respuesta de error
                FunctionsGeneral.AddLog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }
        [HttpPost("ResetPassUser")]
        public async Task<IActionResult> ResetPassword(ResetPassUser user)
        {
            try
            {
                //Func funcn = new Func(_configuration);
                await FunctionsGeneral.SendEmail(user.Email);

                return Ok();
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpGet("AllUser")]
        public ActionResult<IEnumerable<User>> GetUsers()
        {

            return Ok(_Services.GetUsers());
        }
        [HttpPost("CreateUser")]
        public IActionResult CreateUser([FromBody]User entity)
        {
            try
            {
                if(entity.Id_user<=0)
                {
                    return BadRequest("El Id del usuario de ser un valor aceptable");
                }

                // Generar salt
                string salt = BCrypt.Net.BCrypt.GenerateSalt();
                // Hashear la contraseña
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(entity.password_user + salt);
                entity.salt = salt;                    // Usa entity.salt en lugar de User.salt
                entity.password_user = hashedPassword; // Usa entity.password_user para almacenar la contraseña hasheada
                entity.token_user = "";
                _Services.Add(entity);
                return Ok(new
                {
                    message = "User creado con éxito"
                });
                //}
                //return BadRequest(errores);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }

        }
        [HttpGet("ConsulUser")]
        public ActionResult<User> GetUserById(int Id_user)
        {
            var user = _Services.GetUserById(Id_user);
            if (user != null)
            {
                return Ok(user);
            }
            else
            {
                return NotFound("User ot found");
            }
        }
        [HttpPost("UpdateUser")]
        public IActionResult UpdateUser(User entity)
        {
            try
            {
                if (entity.Id_user <= 0) // Verifica que el ID sea válido
                {
                    return BadRequest("Invalid user ID.");
                }

                // Llamar al método de actualización en el servicio
                _Services.UpdateUser(entity.Id_user, entity);

                return Ok("User updated successfully.");
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
        [HttpGet("ConsulUsersInRange")]
        public ActionResult<IEnumerable<User>> GetUsersInRange(int startId, int endId)
        {
            try
            {
                var users = _Services.GetUsersInRange(startId, endId);
                if (users == null || !users.Any())
                {
                    return NotFound("No users found in the specified range.");
                }
                return Ok(users);
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpDelete("DeleteUser")]
        public IActionResult DeleteUserById(int Id_user)
        {
            try
            {
                if (Id_user <= 0)
                {
                    return BadRequest("Invalid user ID.");
                }

                var result = _Services.DeleteById(Id_user);

                if (result)
                {
                    return Ok("User deleted successfully.");
                }
                else
                {
                    return NotFound("User not found.");
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
