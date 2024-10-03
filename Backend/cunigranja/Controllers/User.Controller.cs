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
        public IConfiguration _configuration { get; set; }
        private readonly UserServices userServices;
        public JwtModel JWT;
        public GeneralFunctions FunctionsGeneral;
        public UserController(IConfiguration configuration, UserServices userservices)
        {
            FunctionsGeneral = new GeneralFunctions(configuration);
            _configuration = configuration;
            userServices = userservices;
            JWT = _configuration.GetSection("JWT").Get<JwtModel>();
        }

        // POST: LoginController/Create
        [HttpPost ("Login")]
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
                    Subject=subject,
                    Expires=DateTime.UtcNow.AddMinutes(Convert.ToDouble(JWT.JwtExpiretime)),
                    SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(Key),
                        SecurityAlgorithms.HmacSha256Signature
                        )

                };
                var token = new JwtSecurityTokenHandler().CreateToken(tokenDescriptor);



                return Ok(new JwtSecurityTokenHandler().WriteToken(token)); 
            }
            catch(Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                return StatusCode(500,ex.ToString());
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
            public ActionResult<IEnumerable<User>> AllUsers()
            {
                return Ok(userServices.GetUsers());
            }
        [HttpPost("CreateUser")]
        public IActionResult CreateUser(User user)
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                FunctionsGeneral.AddLog(ex.Message);
                 
                return StatusCode(500, ex.ToString());
            }
        }

    }
}
