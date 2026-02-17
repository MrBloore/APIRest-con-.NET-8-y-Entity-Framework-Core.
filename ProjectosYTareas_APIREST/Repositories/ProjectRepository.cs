//Implementación del repositorio de proyectos utilizando Entity Framework Core.

using Context.Repository;
using Microsoft.EntityFrameworkCore;
using ProjectosYTareas_APIREST.Models;

namespace ProjectosYTareas_APIREST.Repositories
{
    // Clase del repositorio de proyectos, implementando la interfaz IProjectRepository.
    public class ProjectRepository : IProjectRepository
    {
        private readonly AppDbContext _context;

        // Constructor que recibe el contexto de la DB a traves de inyeccion de dependencias (requerimiento).
        public ProjectRepository(AppDbContext context)
        {
            _context = context;
        }

        //Obteniendo todos los proyectos.
        public async Task<IEnumerable<Project>> GetAllAsync()
        {
            return await _context.Projects
                .Include(p => p.TaskItems)
                .ToListAsync();
        }

        //Obteniendo un proyecto por su ID.
        public async Task<Project?> GetByIdAsync(Guid id)
        {
            return await _context.Projects
                .Include(p => p.TaskItems)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        //Obteniendo proyectos por su estado.
        public async Task<Project> CreateAsync(Project project)
        {
            project.Id = Guid.NewGuid();
            project.CreatedAt = DateOnly.FromDateTime(DateTime.Now);
            
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();
            
            return project;
        }

        //Actualizando un proyecto existente.
        public async Task<Project> UpdateAsync(Project project)
        {
            var existingProject = await _context.Projects
                .Include(p => p.TaskItems)
                .FirstOrDefaultAsync(p => p.Id == project.Id);

            if (existingProject == null)
                throw new InvalidOperationException($"Project with ID {project.Id} not found.");

            existingProject.Name = project.Name;
            existingProject.Description = project.Description;
            existingProject.Status = project.Status;

            _context.Projects.Update(existingProject);
            await _context.SaveChangesAsync();

            return existingProject;
        }

        //Eliminando un proyecto por su ID.
        public async Task<bool> DeleteAsync(Guid id)
        {
            var project = await _context.Projects.FindAsync(id);
            
            if (project == null)
                return false;

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return true;
        }

        // Verificando si un proyecto existe por su ID.
        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _context.Projects.AnyAsync(p => p.Id == id);
        }
    }
}
