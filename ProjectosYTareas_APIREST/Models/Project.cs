namespace ProjectosYTareas_APIREST.Models
{
    //Clase para representar los proyectos.
    public class Project
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public ProjectStatus Status { get; set; } = ProjectStatus.Active;
        public DateOnly CreatedAt { get; set; }

        // Relacion uno a muchos de un proyecto con multiples tareas.
        public ICollection<TaskItem> TaskItems { get; set; } = new List<TaskItem>();
    }
}
