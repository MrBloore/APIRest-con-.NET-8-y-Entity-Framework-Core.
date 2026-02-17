// Clases DTO para TaskItem.

using ProjectosYTareas_APIREST.Models;

namespace ProjectosYTareas_APIREST.DTOs
{
    public class TaskItemDto
    {
        public Guid Id { get; set; }
        public Guid ProjectId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Models.TaskStatus Status { get; set; }
        public TaskPriority Priority { get; set; }
        public DateOnly DueDate { get; set; }
        public DateOnly CreatedAt { get; set; }
        public string? ProjectName { get; set; }
    }

    public class CreateTaskItemDto
    {
        public Guid ProjectId { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;
        public DateOnly DueDate { get; set; }
    }

    public class UpdateTaskItemDto
    {
        public required string Title { get; set; }
        public required string Description { get; set; }
        public Models.TaskStatus Status { get; set; }
        public TaskPriority Priority { get; set; }
        public DateOnly DueDate { get; set; }
    }
}
