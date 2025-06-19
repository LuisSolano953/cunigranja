using cunigranja.Middleware;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("http://10.6.96.50:3002")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Configurar opciones para manejar correctamente las fechas
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
        options.JsonSerializerOptions.WriteIndented = true;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;

        // Configurar para ignorar valores nulos
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;

        // Configurar para manejar referencias circulares
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// Configuración de Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuración de la base de datos
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaulConnection"),
    new MySqlServerVersion(new Version(8, 0, 23))));

// Configuración de JWT
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

// Servicios
builder.Services.AddScoped<ReproductionServices>();

// Registrar los servicios en el orden correcto para evitar la dependencia circular
// Primero registramos WeighingServices
builder.Services.AddScoped<WeighingServices>();

// Luego registramos RabbitServices que depende de WeighingServices
builder.Services.AddScoped<RabbitServices>();

// Mantener el resto de los servicios como están
builder.Services.AddScoped<CageServices>();
builder.Services.AddScoped<HealthServices>();

// Registrar los servicios de inventario en el orden correcto
// Primero FoodServices ya que otros servicios dependen de él
builder.Services.AddScoped<FoodServices>();
// Luego los servicios que dependen de FoodServices
builder.Services.AddScoped<EntradaServices>();
builder.Services.AddScoped<FeedingServices>();

builder.Services.AddScoped<UserServices>();
builder.Services.AddScoped<RaceServices>();
builder.Services.AddScoped<MountsServices>();
builder.Services.AddScoped<DesteteServices>();
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
//app.UseMiddleware<JwtMiddleware>();

// Mapea los controladores
app.MapControllers();
app.UseStaticFiles(); // Activa la carpeta wwwroot como pública


app.Run();
