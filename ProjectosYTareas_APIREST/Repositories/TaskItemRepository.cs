//Implementación del repositorio para TaskItem, utilizando Entity Framework Core.

using Context.Repository;
using Microsoft.EntityFrameworkCore;
using ProjectosYTareas_APIREST.Models;

namespace ProjectosYTareas_APIREST.Repositories
{

    // Clase del repositorio de TaskItem, implementando la interfaz ITaskItemRepository.
    public class TaskItemRepository : ITaskItemRepository
    {
        private readonly AppDbContext _context;

        // Constructor que recibe el contexto de la DB a traves de inyeccion de dependencias (requerimiento).
        public TaskItemRepository(AppDbContext context)
        {
            _context = context;
        }

        // Obteniendo todas las tareas.
        public async Task<IEnumerable<TaskItem>> GetAllAsync()
        {
            return await _context.TaskItems
                .Include(t => t.Project)
                .ToListAsync();
        }

        // Obteniendo las tareas por el ID del proyecto.
        public async Task<IEnumerable<TaskItem>> GetByProjectIdAsync(Guid projectId)
        {
            return await _context.TaskItems
                .Where(t => t.ProjectId == projectId)
                .Include(t => t.Project)
                .ToListAsync();
        }

        // Obteniendo una tarea por su ID.
        public async Task<TaskItem?> GetByIdAsync(Guid id)
        {
            return await _context.TaskItems
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        // Creando una nueva tarea.
        public async Task<TaskItem> CreateAsync(TaskItem taskItem)
        {
            taskItem.Id = Guid.NewGuid();
            taskItem.CreatedAt = DateOnly.FromDateTime(DateTime.Now);

            _context.TaskItems.Add(taskItem);
            await _context.SaveChangesAsync();

            return taskItem;
        }

        // Actualizando una tarea existente.
        public async Task<TaskItem> UpdateAsync(TaskItem taskItem)
        {
            var existingTaskItem = await _context.TaskItems.FindAsync(taskItem.Id);

            if (existingTaskItem == null)
                throw new InvalidOperationException($"TaskItem with ID {taskItem.Id} not found.");

            existingTaskItem.Title = taskItem.Title;
            existingTaskItem.Description = taskItem.Description;
            existingTaskItem.Status = taskItem.Status;
            existingTaskItem.Priority = taskItem.Priority;
            existingTaskItem.DueDate = taskItem.DueDate;

            _context.TaskItems.Update(existingTaskItem);
            await _context.SaveChangesAsync();

            return existingTaskItem;
        }

        // Eliminando una tarea por su ID.
        public async Task<bool> DeleteAsync(Guid id)
        {
            var taskItem = await _context.TaskItems.FindAsync(id);

            if (taskItem == null)
                return false;

            _context.TaskItems.Remove(taskItem);
            await _context.SaveChangesAsync();

            return true;
        }

        // Verificando si una tarea existe por su ID.
        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _context.TaskItems.AnyAsync(t => t.Id == id);
        }

        // Verificando si un proyecto existe por su ID.
        public async Task<bool> ProjectExistsAsync(Guid projectId)
        {
            return await _context.Projects.AnyAsync(p => p.Id == projectId);
        }
    }
}
