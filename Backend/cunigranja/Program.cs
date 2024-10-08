using cunigranja.Models;
using cunigranja.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options => options.UseMySql
(builder.Configuration.GetConnectionString("DefaulConnection"), new MySqlServerVersion(new Version(8, 0, 23))));

builder.Services.AddScoped<ReproductionServices>();
builder.Services.AddScoped<ResponsibleServices>();
builder.Services.AddScoped<CageServices>();
builder.Services.AddScoped<HealthServices>();
builder.Services.AddScoped<FoodServices>();
builder.Services.AddScoped<UserServices>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
