using cunigranja.Functions;
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
                var claims = new List<Claim>
                {
                    new Claim("User", login.Email),
                    // Agregar el tipo de usuario como claim
                    new Claim("tipo_user", user.tipo_user ?? "usuario")
                };

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
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
                    u.ResetTokenExpiration > DateTime.UtcNow);   // <-- comparar con ahora

                if (user == null)
                    return Unauthorized(new { message = "Token inválido o expirado" });

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
                return BadRequest(new { message = "Token y nueva contraseña son obligatorios." });

            try
            {
                var user = _Services.GetUsers().FirstOrDefault(u =>
                    u.ResetToken == model.Token &&
                    u.ResetTokenExpiration > DateTime.UtcNow);   // <-- comparar con ahora

                if (user == null)
                    return BadRequest(new { message = "Token inválido o expirado." });
            

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
        public IActionResult CreateUser([FromBody] User entity)
        {
            try
            {
                // Verificar si el correo es el de administrador predefinido
                if (entity.email_user == "cunigranja@gmail.com")
                {
                    entity.tipo_user = "administrador";
                }

                // Si no se especifica un tipo de usuario, asignar "usuario" por defecto
                if (string.IsNullOrEmpty(entity.tipo_user))
                {
                    entity.tipo_user = "usuario";
                }

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
        public IActionResult UpdateUser([FromBody] User entity)
        {
            try
            {
                if (entity == null || entity.Id_user <= 0)
                {
                    return BadRequest("Invalid user data.");
                }

                // Obtener el usuario actual
                var existingUser = _Services.GetUserById(entity.Id_user);
                if (existingUser == null)
                {
                    return NotFound("User not found.");
                }

                // Actualizar solo los campos que no son nulos
                if (entity.blockard != null)
                {
                    existingUser.blockard = entity.blockard;
                    // Actualizar también el estado
                    existingUser.estado = entity.blockard == 1 ? "Inactivo" : "Activo";
                }

                if (!string.IsNullOrEmpty(entity.name_user))
                {
                    existingUser.name_user = entity.name_user;
                }

                if (!string.IsNullOrEmpty(entity.email_user))
                {
                    existingUser.email_user = entity.email_user;
                }

                if (!string.IsNullOrEmpty(entity.tipo_user))
                {
                    existingUser.tipo_user = entity.tipo_user;
                }

                // No actualizar campos sensibles a menos que se proporcionen explícitamente
                if (!string.IsNullOrEmpty(entity.password_user))
                {
                    existingUser.password_user = entity.password_user;
                }

                if (!string.IsNullOrEmpty(entity.salt))
                {
                    existingUser.salt = entity.salt;
                }

                // Llamar al método de actualización en el servicio
                _Services.UpdateUser(entity.Id_user, existingUser);

                return Ok(new { message = "User updated successfully." });
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

        // Endpoint para recuperar la contraseña de administrador
        [HttpPost("RecoverAdminPassword")]
        public async Task<IActionResult> RecoverAdminPassword([FromBody] ResetPassUser model)
        {
            try
            {
                if (model == null || string.IsNullOrEmpty(model.Email) || !FunctionsGeneral.IsValidEmail(model.Email))
                {
                    return BadRequest("El Email proporcionado no es válido.");
                }

                // Verificar si el usuario existe y es administrador
                var dbUser = _Services.GetByEmail(model.Email);
                if (dbUser == null)
                {
                    return NotFound("Usuario no encontrado.");
                }

                if (dbUser.tipo_user != "administrador")
                {
                    return BadRequest("Solo los administradores pueden recuperar esta contraseña.");
                }

                // Generar un token único para el restablecimiento de contraseña
                var resetToken = Guid.NewGuid().ToString();

                // Guardar el token en la base de datos
                dbUser.ResetToken = resetToken;
                dbUser.ResetTokenExpiration = DateTime.UtcNow.AddMinutes(30); // Expira en 30 minutos
                _Services.UpdateUser(dbUser.Id_user, dbUser);

                // Enviar el correo con el token
                var result = await FunctionsGeneral.SendEmail(model.Email, resetToken);

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
        // En UserController.cs
        [HttpPut("UpdateUserStatus")]
        public IActionResult UpdateUserStatus([FromBody] User userUpdate)
        {
            try
            {
                if (userUpdate == null)
                {
                    return BadRequest("Datos de usuario nulos");
                }

                if (userUpdate.Id_user <= 0)
                {
                    return BadRequest($"ID de usuario inválido: {userUpdate.Id_user}");
                }

                // Obtener el usuario actual
                var user = _Services.GetUserById(userUpdate.Id_user);
                if (user == null)
                {
                    return NotFound($"Usuario no encontrado con ID: {userUpdate.Id_user}");
                }

                // Actualizar solo el campo blockard y estado
                user.blockard = userUpdate.blockard;
                user.estado = userUpdate.blockard == 1 ? "Inactivo" : "Activo";

                // Guardar los cambios
                _Services.UpdateUser(user.Id_user, user);

                return Ok(new
                {
                    message = "Estado del usuario actualizado correctamente",
                    blockard = user.blockard,
                    estado = user.estado
                });
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.ToString());
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpGet("ToggleUserStatus")]
        public IActionResult ToggleUserStatus(int userId, int newStatus)
        {
            try
            {
                if (userId <= 0)
                {
                    return BadRequest("ID de usuario inválido");
                }

                // Obtener el usuario actual
                var user = _Services.GetUserById(userId);
                if (user == null)
                {
                    return NotFound("Usuario no encontrado");
                }

                // Actualizar el estado
                user.blockard = newStatus;
                user.estado = newStatus == 1 ? "Inactivo" : "Activo";

                // Guardar los cambios
                _Services.UpdateUser(userId, user);

                return Ok(new { message = "Estado actualizado correctamente" });
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.ToString());
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPost("ChangePassword")]
        public IActionResult ChangePassword([FromBody] LoginUser model)
        {
            if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
                return BadRequest(new { message = "Email y nueva contraseña son obligatorios." });

            try
            {
                // Buscar el usuario por email
                var user = _Services.GetByEmail(model.Email);

                if (user == null)
                    return NotFound(new { message = "Usuario no encontrado." });

                // Generar nuevo salt
                string salt = BCrypt.Net.BCrypt.GenerateSalt();

                // Hashear la nueva contraseña
                user.password_user = BCrypt.Net.BCrypt.HashPassword(model.Password + salt);
                user.salt = salt;

                // Guardar cambios en la base de datos
                _Services.UpdateUser(user.Id_user, user);

                return Ok(new { message = "Contraseña actualizada correctamente." });
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.ToString());
                return StatusCode(500, new { message = "Error en el servidor", error = ex.Message });
            }
        }
        // NUEVO ENDPOINT PARA ENVIAR NOTIFICACIONES DE NUEVAS CUENTAS
        [HttpPost("SendNewAccountNotification")]
        public async Task<IActionResult> SendNewAccountNotification([FromBody] NewAccountNotificationRequest request)
        {
            try
            {
                // Validar que todos los campos requeridos estén presentes
                if (string.IsNullOrEmpty(request.AdminEmail) ||
                    string.IsNullOrEmpty(request.NewUserName) ||
                    string.IsNullOrEmpty(request.NewUserEmail) ||
                    string.IsNullOrEmpty(request.UserType))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Todos los campos son requeridos"
                    });
                }

                // Validar formato de email
                if (!FunctionsGeneral.IsValidEmail(request.AdminEmail) ||
                    !FunctionsGeneral.IsValidEmail(request.NewUserEmail))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Formato de email inválido"
                    });
                }

                // Verificar que el administrador principal existe
                var adminUser = _Services.GetByEmail(request.AdminEmail);
                if (adminUser == null || adminUser.tipo_user != "administrador")
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Administrador principal no encontrado"
                    });
                }

                // Enviar la notificación usando el método existente en GeneralFunctions
                var result = await FunctionsGeneral.SendNewAccountNotification(
                    request.AdminEmail,
                    request.NewUserName,
                    request.NewUserEmail,
                    request.UserType
                );

                if (result.status)
                {
                    return Ok(new
                    {
                        success = true,
                        message = result.Message
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        success = false,
                        message = result.Message
                    });
                }
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog($"Error en SendNewAccountNotification: {ex.Message}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor"
                });
            }
        }

    }
}
