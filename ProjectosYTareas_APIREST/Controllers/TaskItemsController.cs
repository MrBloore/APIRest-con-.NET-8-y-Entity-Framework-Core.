//Controlador para gestionar las TaskItems de los proyectos, con endpoints para CRUD y manejo de errores.

using Microsoft.AspNetCore.Mvc;
using ProjectosYTareas_APIREST.DTOs;
using ProjectosYTareas_APIREST.Services;

namespace ProjectosYTareas_APIREST.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskItemsController : ControllerBase
    {
        private readonly ITaskItemService _taskItemService;

        public TaskItemsController(ITaskItemService taskItemService)
        {
            _taskItemService = taskItemService;
        }

        
        //Obtiene todas las tareas.
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<TaskItemDto>>> GetAllTaskItems()
        {
            var taskItems = await _taskItemService.GetAllTaskItemsAsync();
            return Ok(taskItems);
        }

        
        //Obtiene todas las tareas de un proyecto específico.
        [HttpGet("project/{projectId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<TaskItemDto>>> GetTaskItemsByProjectId(Guid projectId)
        {
            var taskItems = await _taskItemService.GetTaskItemsByProjectIdAsync(projectId);
            return Ok(taskItems);
        }

        
        //Obtiene una tarea por su ID.
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<TaskItemDto>> GetTaskItemById(Guid id)
        {
            var taskItem = await _taskItemService.GetTaskItemByIdAsync(id);

            if (taskItem == null)
                throw new KeyNotFoundException($"TaskItem with ID {id} not found.");

            return Ok(taskItem);
        }

        
        //Crea una nueva tarea para un proyecto.
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<TaskItemDto>> CreateTaskItem([FromBody] CreateTaskItemDto createTaskItemDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var taskItem = await _taskItemService.CreateTaskItemAsync(createTaskItemDto);
            return CreatedAtAction(nameof(GetTaskItemById), new { id = taskItem.Id }, taskItem);
        }

        
        //Actualiza una tarea existente.
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<TaskItemDto>> UpdateTaskItem(Guid id, [FromBody] UpdateTaskItemDto updateTaskItemDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var taskItem = await _taskItemService.UpdateTaskItemAsync(id, updateTaskItemDto);
            return Ok(taskItem);
        }

        
        //Elimina una tarea por su ID.
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteTaskItem(Guid id)
        {
            await _taskItemService.DeleteTaskItemAsync(id);
            return NoContent();
        }
    }
}
