using Microsoft.EntityFrameworkCore;
using ProjectosYTareas_APIREST.Models;

namespace Context.Repository
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base (options)
        {

        }

        public DbSet<TaskItem> TaskItems { get; set; }
        public DbSet<Project> Projects { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurar relación entre Project y TaskItem
            modelBuilder.Entity<TaskItem>()
                .HasOne(t => t.Project)              // Cada TaskItem tiene un Project (requerimiento).
                .WithMany(p => p.TaskItems)          // Un Project tiene muchas TaskItems (requerimiento).
                .HasForeignKey(t => t.ProjectId)     // Llave foranea de TaskItem hacia Project.
                .OnDelete(DeleteBehavior.Cascade);   // Se eliminan las tareas del proyecto al eliminarse este.
        }
    }
}

