﻿using cunigranja.Functions;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Authorization;
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
        public UserController(IConfiguration configuration, UserServices _userservices)
        {
            FunctionsGeneral = new GeneralFunctions(configuration);
            _Services = _userservices;
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
                if (user == null || !BCrypt.Net.BCrypt.Verify(login.Password + user.salt, user.password_user))
                {
                    return Unauthorized(new { message = "Credenciales incorrectas." });
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
                if (user == null || string.IsNullOrEmpty(user.Email) || !FunctionsGeneral.IsValidEmail(user.Email))
                {
                    return BadRequest("El Email proporcionado no es válido.");
                }

                // Verificar si el usuario existe
                var dbUser = _Services.GetByEmail(user.Email);
                if (dbUser == null)
                {
                    return NotFound("Usuario no encontrado.");
                }

                // Generar un token único para el restablecimiento de contraseña
                var resetToken = Guid.NewGuid().ToString();
                
                // Guardar el token en la base de datos
                dbUser.ResetToken = resetToken;
                dbUser.ResetTokenExpiration = DateTime.UtcNow.AddMinutes(30); // Expira en 30 minutos
                _Services.UpdateUser(dbUser.Id_user, dbUser);
                
                // Enviar el correo con el token
                var result = await FunctionsGeneral.SendEmail(user.Email, resetToken);

                if (result.status)
                {
                    return Ok(new { message = "Correo enviado exitosamente" });
                }
                else
                {
                    return StatusCode(500, "Error al enviar el correo");
                }
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
        
        [HttpPost("ValidateToken")]
        public IActionResult ValidateToken([FromBody] TokenRequest model)
        {
            if (string.IsNullOrEmpty(model.Token))
                return Unauthorized(new { message = "Token no proporcionado" });

            try
            {
                var user = _Services.GetUsers().FirstOrDefault(u => 
                    u.ResetToken == model.Token && 
                    u.ResetTokenExpiration > DateTime.UtcNow);

                if (user == null)
                {
                    return Unauthorized(new { message = "Token inválido o expirado" });
                }

                return Ok(new { message = "Token válido", email = user.email_user });
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.ToString());
                return StatusCode(500, new { message = "Error en el servidor", error = ex.Message });
            }
        }

        [HttpPost("ResetPasswordConfirm")]
        public IActionResult ResetPasswordConfirm([FromBody] ResetPasswordModel model)
        {
            if (string.IsNullOrEmpty(model.Token) || string.IsNullOrEmpty(model.NewPassword))
            {
                return BadRequest(new { message = "Token y nueva contraseña son obligatorios." });
            }

            try
            {
                var user = _Services.GetUsers().FirstOrDefault(u => 
                    u.ResetToken == model.Token && 
                    u.ResetTokenExpiration > DateTime.UtcNow);

                if (user == null)
                {
                    return BadRequest(new { message = "Token inválido o expirado." });
                }

                // Generar nuevo hash de contraseña
                string salt = BCrypt.Net.BCrypt.GenerateSalt();
                user.password_user = BCrypt.Net.BCrypt.HashPassword(model.NewPassword + salt);
                user.salt = salt;

                // Borrar el token de restablecimiento después de cambiar la contraseña
                user.ResetToken = null;
                user.ResetTokenExpiration = null;

                // Guardar cambios en la base de datos
                _Services.UpdateUser(user.Id_user, user);

                return Ok(new { message = "Contraseña restablecida correctamente." });
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.ToString());
                return StatusCode(500, new { message = "Error en el servidor", error = ex.Message });
            }
        }
        
        [HttpGet("AllUser")]
        public ActionResult<IEnumerable<User>> GetUsers()
        {
            try
            {
                 return Ok(_Services.GetUsers());

            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
            }

        }
        
        [HttpPost("CreateUser")]
        public IActionResult CreateUser([FromBody]User entity)
        {
            try
            {
                // Generar salt
                string salt = BCrypt.Net.BCrypt.GenerateSalt();
                // Hashear la contraseña
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(entity.password_user + salt);
                entity.salt = salt;                    
                entity.password_user = hashedPassword; 
                entity.token_user = "";
        
                // Asegurarse de que los campos de restablecimiento de contraseña sean nulos
                entity.ResetToken = null;
                entity.ResetTokenExpiration = null;
        
                _Services.Add(entity);
                return Ok(new
                {
                    message = "User creado con éxito"
                });
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
            try
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
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500, ex.ToString());
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
