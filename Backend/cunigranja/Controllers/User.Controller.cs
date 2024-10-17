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
        public IActionResult Login(LoginUser Login)
        {
            try
            {
                var Key = Encoding.UTF8.GetBytes(JWT.KeySecret);
                ClaimsIdentity subject = new ClaimsIdentity(new Claim[]
                {
                new Claim("User", Login.Email)

                });

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = subject,
                    Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(JWT.JwtExpiretime)),
                    SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(Key),
                        SecurityAlgorithms.HmacSha256Signature
                        )

                };
                var token = new JwtSecurityTokenHandler().CreateToken(tokenDescriptor);



                return Ok(new JwtSecurityTokenHandler().WriteToken(token));
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
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
        public IActionResult Add(User entity)
        {
            try
            {
                //var errores = FunctionsGeneral.ValidModel(user);
                //if (errores.Length == 0)
                //{
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
