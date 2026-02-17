//Interfaz para el repositorio de TaskItem, como realizar las operaciones CRUD en los TaskItems.

using ProjectosYTareas_APIREST.Models;

namespace ProjectosYTareas_APIREST.Repositories
{
    public interface ITaskItemRepository
    {
        Task<IEnumerable<TaskItem>> GetAllAsync();
        Task<IEnumerable<TaskItem>> GetByProjectIdAsync(Guid projectId);
        Task<TaskItem?> GetByIdAsync(Guid id);
        Task<TaskItem> CreateAsync(TaskItem taskItem);
        Task<TaskItem> UpdateAsync(TaskItem taskItem);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> ExistsAsync(Guid id);
        Task<bool> ProjectExistsAsync(Guid projectId);
    }
}
