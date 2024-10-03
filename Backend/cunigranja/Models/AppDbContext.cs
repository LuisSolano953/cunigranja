using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace cunigranja.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<UsersModel> user { get; set; }
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
