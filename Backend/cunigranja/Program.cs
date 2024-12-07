using cunigranja.Middleware;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
<<<<<<< HEAD
using System.Text.Json;
=======
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder=> builder
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());
});

// Add services to the container.
builder.Services.AddControllers();
// Configuración de Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuración de la base de datos
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaulConnection"),
    new MySqlServerVersion(new Version(8, 0, 23))));

// Configuración de JWT
<<<<<<< HEAD
//var key = builder.Configuration.GetSection("JWT:KeySecret").Value;

//builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//    .AddJwtBearer(options =>
//    {
//    options.TokenValidationParameters = new TokenValidationParameters
//    {
//        ValidateIssuerSigningKey = true,
//        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
//        ValidateIssuer = false,
//        ValidateAudience = false,
//        ClockSkew = TimeSpan.Zero
//    };

//    options.Events = new JwtBearerEvents
//    {
//        OnChallenge = context =>
//        {
//            context.HandleResponse();
//            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
//            context.Response.ContentType = "aplication/json";

//            if (string.IsNullOrEmpty(context.Error)) context.Error = "Token invalido o no autorizado";

//            if (string.IsNullOrEmpty(context.ErrorDescription))
//                context.ErrorDescription = "Esta solicitud requiere que se proporsione un token de acceso JWT valido";
//            if (context.AuthenticateFailure != null && context.AuthenticateFailure.GetType() == typeof(SecurityTokenExpiredException))
//            {
//                var authenticationException = context.AuthenticateFailure as SecurityTokenExpiredException;
//                context.Response.Headers.Add("x-token-expired", authenticationException.Expires.ToString("o"));
//                context.ErrorDescription = $"el token expiro el{authenticationException.Expires.ToString("o")}";
//            }

//            return context.Response.WriteAsync(JsonSerializer.Serialize(new
//            {
//                error = context.Error,
//                error_description = context.ErrorDescription
//            }
//                ));
//        }
        
//        };
//    });
=======
var key = builder.Configuration.GetSection("JWT:KeySecret").Value;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };

        //options.Events = new JwtBearerEvents
        //{
        //    OnMessageReceived = context =>
        //    {
        //        if (string.IsNullOrEmpty(context.Request.Headers["Authorization"]))
        //        {
        //            context.NoResult();
        //            context.Response.StatusCode = 401;
        //            context.Response.ContentType = "application/json";
        //            return context.Response.WriteAsync("{\"error\": \"Token no proporcionado\"}");
        //        }
        //        return Task.CompletedTask;
        //    },
        //    OnAuthenticationFailed = context =>
        //    {
        //        context.NoResult();
        //        context.Response.StatusCode = 401;
        //        context.Response.ContentType = "application/json";
        //        return context.Response.WriteAsync("{\"error\": \"Token inválido o expirado\"}");
        //    },
        //    OnChallenge = context =>
        //    {
        //        context.HandleResponse();
        //        if (!context.Response.HasStarted)
        //        {
        //            context.Response.StatusCode = 401;
        //            context.Response.ContentType = "application/json";
        //            return context.Response.WriteAsync("{\"error\": \"No autorizado: falta token\"}");
        //        }
        //        return Task.CompletedTask;
        //    }
        //};
    });
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4

// Servicios
builder.Services.AddScoped<ReproductionServices>();
builder.Services.AddScoped<WeighingServices>();
builder.Services.AddScoped<CageServices>();
builder.Services.AddScoped<HealthServices>();
builder.Services.AddScoped<FoodServices>();
builder.Services.AddScoped<UserServices>();
builder.Services.AddScoped<RaceServices>();
builder.Services.AddScoped<FeedingServices>();
builder.Services.AddScoped<MortalityServices>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Asegúrate de agregar el middleware de routing y autenticación en el orden correcto
app.UseCors("AllowSpecificOrigin");
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

// Middleware de JWT
<<<<<<< HEAD
//app.UseMiddleware<JwtMiddleware>();
=======
app.UseMiddleware<JwtMiddleware>();
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4

// Mapea los controladores
app.MapControllers();

app.Run();
