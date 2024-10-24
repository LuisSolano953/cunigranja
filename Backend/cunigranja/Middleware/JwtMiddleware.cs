using cunigranja.Models;
using cunigranja.Services;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace cunigranja.Middleware
{
    public class JwtMiddleware
    {
        private readonly IConfiguration _configuration;
        private readonly RequestDelegate _next;
        public JwtModel Jwt;

        public JwtMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _configuration = configuration;
            Jwt = _configuration.GetSection("JWT").Get<JwtModel>();
        }

        public async Task Invoke(HttpContext context, UserServices userService)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault ()?.Split(" ").Last();
            if (token != null)
                 AttachUserToContext(context, userService, token);
            await _next(context);
        }

        private async Task AttachUserToContext(HttpContext context, UserServices userService, string token)
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
            }
            catch
            {
                // No adjuntar el usuario si la validación falla
            }
        }
    }

}
