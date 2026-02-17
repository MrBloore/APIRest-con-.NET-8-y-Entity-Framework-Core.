// Clases DTO para Project.

using ProjectosYTareas_APIREST.Models;

namespace ProjectosYTareas_APIREST.DTOs
{
    public class ProjectDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ProjectStatus Status { get; set; }
        public DateOnly CreatedAt { get; set; }
        public int TaskItemsCount { get; set; }
    }

    public class CreateProjectDto
    {
        public required string Name { get; set; }
        public required string Description { get; set; }
    }

    public class UpdateProjectDto
    {
        public required string Name { get; set; }
        public required string Description { get; set; }
        public ProjectStatus Status { get; set; }
    }
}
