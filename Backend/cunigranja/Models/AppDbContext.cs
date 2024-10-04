using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace cunigranja.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> user { get; set; }
        public DbSet<ReproductionModel> reproduction { get; set; }
        public DbSet<ResponsibleModel> responsible { get; set; }
        public DbSet<CageModel> cage { get; set; }
        public DbSet<HealthModel> health { get; set; }
        public DbSet<FoodModel> food { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseMySql("Server=localhost;Database=cunigranja;User=root;Password=luis200513;Port=3306",
                    new MySqlServerVersion(new Version(8, 0, 23)));
            };
        }
    }
}
