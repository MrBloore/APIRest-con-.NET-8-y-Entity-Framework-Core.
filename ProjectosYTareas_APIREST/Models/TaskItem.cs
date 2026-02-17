namespace ProjectosYTareas_APIREST.Models
{
    //Clase para representar las tareas dentro de un proyecto.
    public class TaskItem
    {
        public Guid Id { get; set; }
        public Guid ProjectId { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public TaskStatus Status { get; set; } = TaskStatus.InProgress;
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;
        public DateOnly DueDate { get; set; }
        public DateOnly CreatedAt { get; set; }

        // Relacion muchos a uno de multiples tareas con un proyecto.
        public Project? Project { get; set; }
    }
}
