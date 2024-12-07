using cunigranja.Functions;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace cunigranja.Middleware
{
    public class JwtMiddleware
    {
        public GeneralFunctions FunctionsGeneral;
        private readonly IConfiguration _configuration;
        private readonly RequestDelegate _next;
        public JwtModel Jwt;
<<<<<<< HEAD
        private readonly List<string> _publicRoutes;
=======
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4

        public JwtMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
<<<<<<< HEAD
            FunctionsGeneral = new GeneralFunctions(_configuration);
            Jwt = _configuration.GetSection("JWT").Get<JwtModel>();
            _publicRoutes = _configuration.GetSection("RutePublic")
                            .Get<List<RouteConfig>>()
                            .Select(route => route.Route)
                            .ToList();
=======
            _configuration = configuration;
            Jwt = _configuration.GetSection("JWT").Get<JwtModel>();
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
        }

        public async Task Invoke(HttpContext context, UserServices userService)
        {
            try
            {
                var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
<<<<<<< HEAD

                var path = context.Request.Path;

               
                if (_publicRoutes.Contains(path))
                {
                    await _next(context);
                    return;
                }
                if (token == null)
                {
                    context.Response.StatusCode = 401;
                    context.Response.ContentType = "aplication/json";
                    await context.Response.WriteAsync("{\"error\":\"token invalido o no autorizado.\"}");
                }
                if (!AttachUserToContext(context, userService, token))
                {
                    context.Response.StatusCode = 401;
                    context.Response.ContentType = "aplication/json";
                    await context.Response.WriteAsync("{\"error\":\"token invalido o no autorizado.\"}");
                }
                await _next(context);
                return;
                
=======
                if (token != null)
                {
                     AttachUserToContext(context, userService, token);
                }
                await _next(context);
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
            }
            catch (Exception ex)
            {

<<<<<<< HEAD
                throw;
            }
        }

        public bool AttachUserToContext(HttpContext context, UserServices userService, string token)
=======
                FunctionsGeneral.AddLog(ex.ToString());
               

            }
        }

        public  void AttachUserToContext(HttpContext context, UserServices userService, string token)
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
        {
            try
            {
                var key = Encoding.UTF8.GetBytes(Jwt.KeySecret);
                var tokenHandler = new JwtSecurityTokenHandler();
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userEmail = jwtToken.Claims.First(x => x.Type == "User").Value;

                context.Items["User"] = userService.GetByEmail(userEmail);
<<<<<<< HEAD
                return true;
            }
            catch (Exception ex)
            {

                FunctionsGeneral.AddLog(ex.Message);
                return false;
            }

        }
=======
            }
            catch(Exception ex)
            {
             
                FunctionsGeneral.AddLog(ex.Message);
            }

         }
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
    }

}
