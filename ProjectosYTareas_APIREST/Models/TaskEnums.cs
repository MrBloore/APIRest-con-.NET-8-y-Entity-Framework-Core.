// Enums para el estado y prioridad de las tareas.

namespace ProjectosYTareas_APIREST.Models
{
    public enum TaskStatus
    {
        Pending = 1,
        InProgress = 2,
        Completed = 3
    }
    public enum TaskPriority
    {
        Low = 1,
        Medium = 2,
        High = 3
    }
}
