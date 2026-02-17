//Interfaz para el repositorio de proyectos, como realizar las operaciones CRUD en Project.

using ProjectosYTareas_APIREST.Models;

namespace ProjectosYTareas_APIREST.Repositories
{
    public interface IProjectRepository
    {
        Task<IEnumerable<Project>> GetAllAsync();
        Task<Project?> GetByIdAsync(Guid id);
        Task<Project> CreateAsync(Project project);
        Task<Project> UpdateAsync(Project project);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> ExistsAsync(Guid id);
    }
}
