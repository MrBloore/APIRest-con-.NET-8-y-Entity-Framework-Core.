// Interfaz para los proyectos en la API Rest.

using ProjectosYTareas_APIREST.DTOs;

namespace ProjectosYTareas_APIREST.Services
{
    public interface IProjectService
    {
        Task<IEnumerable<ProjectDto>> GetAllProjectsAsync();
        Task<ProjectDto?> GetProjectByIdAsync(Guid id);
        Task<ProjectDto> CreateProjectAsync(CreateProjectDto createProjectDto);
        Task<ProjectDto> UpdateProjectAsync(Guid id, UpdateProjectDto updateProjectDto);
        Task<bool> DeleteProjectAsync(Guid id);
    }
}
