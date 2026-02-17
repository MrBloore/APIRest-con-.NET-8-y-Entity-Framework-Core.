// Implementación del servicio para TaskItem.

using ProjectosYTareas_APIREST.DTOs;
using ProjectosYTareas_APIREST.Models;
using ProjectosYTareas_APIREST.Repositories;

namespace ProjectosYTareas_APIREST.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _projectRepository;

        public ProjectService(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        //Se obtienen todos los proyectos, se mapean a DTOs y se devuelven como una lista.
        public async Task<IEnumerable<ProjectDto>> GetAllProjectsAsync()
        {
            var projects = await _projectRepository.GetAllAsync();
            return projects.Select(MapToDto).ToList();
        }

        //Se obtiene un proyecto por su ID, se mapea a un DTO y se devuelve. Si no se encuentra el proyecto, se devuelve null.
        public async Task<ProjectDto?> GetProjectByIdAsync(Guid id)
        {
            var project = await _projectRepository.GetByIdAsync(id);
            return project == null ? null : MapToDto(project);
        }

        //Se crea un nuevo proyecto a partir de los datos proporcionados en el DTO de creación, se guarda en el repositorio y se devuelve el proyecto creado como un DTO. 
        public async Task<ProjectDto> CreateProjectAsync(CreateProjectDto createProjectDto)
        {
            var project = new Project
            {
                Name = createProjectDto.Name,
                Description = createProjectDto.Description,
                Status = ProjectStatus.Active
            };

            var createdProject = await _projectRepository.CreateAsync(project);
            return MapToDto(createdProject);
        }

        //Se actualiza un proyecto existente con los datos proporcionados en el DTO de actualizacion.
        //Si el proyecto no existe, se lanza una excepcion.
        //Si la actualizacion es exitosa, se devuelve el proyecto actualizado como un DTO.
        public async Task<ProjectDto> UpdateProjectAsync(Guid id, UpdateProjectDto updateProjectDto)
        {
            var existingProject = await _projectRepository.GetByIdAsync(id);

            if (existingProject == null)
                throw new KeyNotFoundException($"No se encontró el Projecto con ID {id}.");

            // Validacion: No se puede marcar el Projecto como Finalizado si hay tareas no completadas.
            if (updateProjectDto.Status == Models.ProjectStatus.Finished)
            {
                if (existingProject.TaskItems != null && existingProject.TaskItems.Count > 0)
                {
                    var incompleteTasks = existingProject.TaskItems
                        .Where(t => t.Status != Models.TaskStatus.Completed)
                        .ToList();

                    if (incompleteTasks.Count > 0)
                        throw new System.InvalidOperationException("No se puede marcar el proyecto como \"Finalizado\". Todas las tareas deben estar \"Completadas\".");
                }
            }

            existingProject.Name = updateProjectDto.Name;
            existingProject.Description = updateProjectDto.Description;
            existingProject.Status = updateProjectDto.Status;

            await _projectRepository.UpdateAsync(existingProject);

            // Volver a cargar el proyecto actualizado para asegurar que las tareas se cargan correctamente.
            var updatedProject = await _projectRepository.GetByIdAsync(id);
            return MapToDto(updatedProject);
        }

        //Se elimina un proyecto por su ID, devolviendo true or false dependiendo del outcome.
        public async Task<bool> DeleteProjectAsync(Guid id)
        {
            var existingProject = await _projectRepository.GetByIdAsync(id);

            if (existingProject == null)
                throw new KeyNotFoundException($"No se encontró el Projecto con ID {id}.");

            // Validación: No se puede eliminar un proyecto si hay tareas no completadas.
            if (existingProject.TaskItems != null && existingProject.TaskItems.Count > 0)
            {
                var incompleteTasks = existingProject.TaskItems
                    .Where(t => t.Status != Models.TaskStatus.Completed)
                    .ToList();

                if (incompleteTasks.Count > 0)
                    throw new System.InvalidOperationException("No se puede eliminar el proyecto. Todas las tareas deben estar \"Completadas\".");
            }

            return await _projectRepository.DeleteAsync(id);
        }

        //Mapeando un objeto Project a un ProjectDto.
        private ProjectDto MapToDto(Project project)
        {
            return new ProjectDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                Status = project.Status,
                CreatedAt = project.CreatedAt,
                TaskItemsCount = project.TaskItems.Count
            };
        }
    }
}
