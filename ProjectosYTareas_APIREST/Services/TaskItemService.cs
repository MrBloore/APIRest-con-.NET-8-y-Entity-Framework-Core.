// Implementación del servicio para TaskItem.

using ProjectosYTareas_APIREST.DTOs;
using ProjectosYTareas_APIREST.Models;
using ProjectosYTareas_APIREST.Repositories;

namespace ProjectosYTareas_APIREST.Services
{

    public class TaskItemService : ITaskItemService
    {
        private readonly ITaskItemRepository _taskItemRepository;

        public TaskItemService(ITaskItemRepository taskItemRepository)
        {
            _taskItemRepository = taskItemRepository;
        }

        //Se obtienen todas las tareas, se mapean a DTOs y se devuelven como una lista.
        public async Task<IEnumerable<TaskItemDto>> GetAllTaskItemsAsync()
        {
            var taskItems = await _taskItemRepository.GetAllAsync();
            return taskItems.Select(MapToDto).ToList();
        }

        //Se verifica si el proyecto existe y si no, se lanza una excepcion.
        //Luego se obtienen las tareas del proyecto, se mapean a DTOs y se devuelven como una lista.
        public async Task<IEnumerable<TaskItemDto>> GetTaskItemsByProjectIdAsync(Guid projectId)
        {
            var projectExists = await _taskItemRepository.ProjectExistsAsync(projectId);
            if (!projectExists)
                throw new KeyNotFoundException($"No se encontró el Projecto con ID {projectId}.");

            var taskItems = await _taskItemRepository.GetByProjectIdAsync(projectId);
            return taskItems.Select(MapToDto).ToList();
        }

        //Se obtiene la tarea por su ID, se verifica si existe y se mapea a DTO antes de devolverlo.
        public async Task<TaskItemDto?> GetTaskItemByIdAsync(Guid id)
        {
            var taskItem = await _taskItemRepository.GetByIdAsync(id);
            return taskItem == null ? null : MapToDto(taskItem);
        }

        //Se verifica si la tarea existe y si no, se lanza una excepcion. 
        //Luego se crea una nueva tarea con los datos del DTO, se guarda en el repositorio y se devuelve el DTO de la tarea creada.
        public async Task<TaskItemDto> CreateTaskItemAsync(CreateTaskItemDto createTaskItemDto)
        {
            var projectExists = await _taskItemRepository.ProjectExistsAsync(createTaskItemDto.ProjectId);
            if (!projectExists)
                throw new KeyNotFoundException($"No se encontró el Projecto con ID {createTaskItemDto.ProjectId}.");

            // Validacion de DueDate para que no sea en el pasado.
            var today = DateOnly.FromDateTime(DateTime.Now);
            if (createTaskItemDto.DueDate < today)
                throw new ArgumentException("La fecha límite no puede ser en el pasado. Seleccionar una fecha válida.");

            var taskItem = new TaskItem
            {
                ProjectId = createTaskItemDto.ProjectId,
                Title = createTaskItemDto.Title,
                Description = createTaskItemDto.Description,
                Priority = createTaskItemDto.Priority,
                DueDate = createTaskItemDto.DueDate,
                Status = Models.TaskStatus.Pending
            };

            var createdTaskItem = await _taskItemRepository.CreateAsync(taskItem);
            return MapToDto(createdTaskItem);
        }

        //Se obtiene la tarea por su ID, se verifica si existe y se actualizan sus propiedades con los datos del DTO.
        //Luego se guarda en el repositorio y se devuelve el DTO de la tarea actualizada.
        public async Task<TaskItemDto> UpdateTaskItemAsync(Guid id, UpdateTaskItemDto updateTaskItemDto)
        {
            var existingTaskItem = await _taskItemRepository.GetByIdAsync(id);

            if (existingTaskItem == null)
                throw new KeyNotFoundException($"No se encontró la tarea con el ID {id}.");

            //No se puede ir de Pendiente directamente a Completada (requerimiento).
            if (existingTaskItem.Status == Models.TaskStatus.Pending && (Models.TaskStatus)updateTaskItemDto.Status == Models.TaskStatus.Completed)
                throw new System.InvalidOperationException("No se puede marcar como \"Completada\" una tarea que está \"Por Hacer\". Primero debe estar \"En Progreso\".");

            existingTaskItem.Title = updateTaskItemDto.Title;
            existingTaskItem.Description = updateTaskItemDto.Description;
            existingTaskItem.Status = updateTaskItemDto.Status;
            existingTaskItem.Priority = updateTaskItemDto.Priority;
            existingTaskItem.DueDate = updateTaskItemDto.DueDate;

            var updatedTaskItem = await _taskItemRepository.UpdateAsync(existingTaskItem);
            return MapToDto(updatedTaskItem);
        }

        //Se verifica si la tarea existe y si no, se lanza una excepcion.
        //Luego se elimina del repositorio y devuelve true o false dependiendo del outcome.
        public async Task<bool> DeleteTaskItemAsync(Guid id)
        {
            return await _taskItemRepository.DeleteAsync(id);
        }

        //Mapeando de TaskItem a TaskItemDto, incluyendo el nombre del proyecto si esta disponible.
        private TaskItemDto MapToDto(TaskItem taskItem)
        {
            return new TaskItemDto
            {
                Id = taskItem.Id,
                ProjectId = taskItem.ProjectId,
                Title = taskItem.Title,
                Description = taskItem.Description,
                Status = taskItem.Status,
                Priority = taskItem.Priority,
                DueDate = taskItem.DueDate,
                CreatedAt = taskItem.CreatedAt,
                ProjectName = taskItem.Project?.Name
            };
        }
    }
}
