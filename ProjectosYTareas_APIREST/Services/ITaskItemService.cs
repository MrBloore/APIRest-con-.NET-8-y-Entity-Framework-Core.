//Interfaz para los elementos de tarea en la API Rest.

using ProjectosYTareas_APIREST.DTOs;

namespace ProjectosYTareas_APIREST.Services
{
    public interface ITaskItemService
    {
        Task<IEnumerable<TaskItemDto>> GetAllTaskItemsAsync();
        Task<IEnumerable<TaskItemDto>> GetTaskItemsByProjectIdAsync(Guid projectId);
        Task<TaskItemDto?> GetTaskItemByIdAsync(Guid id);
        Task<TaskItemDto> CreateTaskItemAsync(CreateTaskItemDto createTaskItemDto);
        Task<TaskItemDto> UpdateTaskItemAsync(Guid id, UpdateTaskItemDto updateTaskItemDto);
        Task<bool> DeleteTaskItemAsync(Guid id);
    }
}
