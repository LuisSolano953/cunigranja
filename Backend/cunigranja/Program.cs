using cunigranja.Middleware;
using cunigranja.Models;
using cunigranja.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Configuraci�n de Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuraci�n de la base de datos
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaulConnection"),
    new MySqlServerVersion(new Version(8, 0, 23))));

// Configuraci�n de JWT
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

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if (string.IsNullOrEmpty(context.Request.Headers["Authorization"]))
                {
                    context.NoResult();
                    context.Response.StatusCode = 401;
                    context.Response.ContentType = "application/json";
                    return context.Response.WriteAsync("{\"error\": \"Token no proporcionado\"}");
                }
                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                context.NoResult();
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                return context.Response.WriteAsync("{\"error\": \"Token inv�lido o expirado\"}");
            },
            OnChallenge = context =>
            {
                context.HandleResponse();
                if (!context.Response.HasStarted)
                {
                    context.Response.StatusCode = 401;
                    context.Response.ContentType = "application/json";
                    return context.Response.WriteAsync("{\"error\": \"No autorizado: falta token\"}");
                }
                return Task.CompletedTask;
            }
        };
    });

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

// Aseg�rate de agregar el middleware de routing y autenticaci�n en el orden correcto
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

// Middleware de JWT
app.UseMiddleware<JwtMiddleware>();

// Mapea los controladores
app.MapControllers();

app.Run();
