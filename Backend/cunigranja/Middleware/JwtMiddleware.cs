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
        private readonly List<string> _publicRoutes;

        public JwtMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            FunctionsGeneral = new GeneralFunctions(_configuration);
            Jwt = _configuration.GetSection("JWT").Get<JwtModel>();
            _publicRoutes = _configuration.GetSection("RutePublic")
                            .Get<List<RouteConfig>>()
                            .Select(route => route.Route)
                            .ToList();
        }

        public async Task Invoke(HttpContext context, UserServices userService)
        {
            try
            {
                var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

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
                
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        public bool AttachUserToContext(HttpContext context, UserServices userService, string token)
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
                return true;
            }
            catch (Exception ex)
            {

                FunctionsGeneral.AddLog(ex.Message);
                return false;
            }

        }
    }

}
