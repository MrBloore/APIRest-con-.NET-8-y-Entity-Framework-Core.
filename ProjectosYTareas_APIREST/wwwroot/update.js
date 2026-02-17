const API_BASE_URL = 'http://localhost:5092/api';

// Logica para cargar proyectos en ambos dropdowns.

async function loadProjectsForUpdate() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        const projects = await response.json();

        // Dropdown para seleccionar proyecto a actualizar.
        const selectProject = document.getElementById('updateProjectSelect');
        selectProject.innerHTML = '<option value="">Selecciona un proyecto...</option>';

        // Dropdown de proyecto para tareas.
        const selectTaskProject = document.getElementById('updateTaskProjectSelect');
        selectTaskProject.innerHTML = '<option value="">Selecciona un proyecto...</option>';

        projects.forEach(project => {
            const optionProject = document.createElement('option');
            optionProject.value = project.id;
            optionProject.textContent = project.name;
            selectProject.appendChild(optionProject);

            const optionTaskProject = document.createElement('option');
            optionTaskProject.value = project.id;
            optionTaskProject.textContent = project.name;
            selectTaskProject.appendChild(optionTaskProject);
        });
    } catch (error) {
        console.error('Error al cargar proyectos: ', error);
    }
}

//Logica para cargar tareas de un proyecto específico.

async function loadTasksByProjectId(projectId) {
    try {
        const response = await fetch(`${API_BASE_URL}/taskitems/project/${projectId}`);
        const tasks = await response.json();

        const selectTask = document.getElementById('updateTaskSelect');
        selectTask.innerHTML = '<option value="">Selecciona una tarea...</option>';

        tasks.forEach(task => {
            const option = document.createElement('option');
            option.value = task.id;
            option.textContent = task.title;
            option.dataset.description = task.description;
            option.dataset.status = task.status;
            option.dataset.priority = task.priority;
            option.dataset.dueDate = task.dueDate;
            selectTask.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar tareas: ', error);
    }
}

//Carga de datos actuales para visualizar contenido de Proyecto antes de actualizarlo.

document.getElementById('updateProjectSelect').addEventListener('change', async (e) => {
    const projectId = e.target.value;
    if (!projectId) return;

    try {
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}`);
        const project = await response.json();

        document.getElementById('updateProjectName').value = project.name;
        document.getElementById('updateProjectDescription').value = project.description;
        document.getElementById('updateProjectStatus').value = project.status;
    } catch (error) {
        console.error('Error al cargar proyecto: ', error);
    }
});

//Carga de tareas cuando se selecciona un proyecto.

document.getElementById('updateTaskProjectSelect').addEventListener('change', (e) => {
    const projectId = e.target.value;
    if (!projectId) {
        document.getElementById('updateTaskSelect').innerHTML = '<option value="">Selecciona una tarea...</option>';
        return;
    }
    loadTasksByProjectId(projectId);
});

//Carga de datos actuales para visualizar contenido de Tarea antes de actualizarlo.

document.getElementById('updateTaskSelect').addEventListener('change', (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    if (!selectedOption.value) return;

    const projectId = document.getElementById('updateTaskProjectSelect').value;
    document.getElementById('updateTaskTitle').value = selectedOption.textContent;
    document.getElementById('updateTaskDescription').value = selectedOption.dataset.description;
    document.getElementById('updateTaskStatus').value = selectedOption.dataset.status;
    document.getElementById('updateTaskPriority').value = selectedOption.dataset.priority;
    document.getElementById('updateTaskDueDate').value = selectedOption.dataset.dueDate;
});

//Logica de formulario para actualizar proyecto.

document.getElementById('updateProjectForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const projectId = document.getElementById('updateProjectSelect').value;
    const projectData = {
        name: document.getElementById('updateProjectName').value,
        description: document.getElementById('updateProjectDescription').value,
        status: parseInt(document.getElementById('updateProjectStatus').value)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectData)
        });

        const messageDiv = document.getElementById('updateProjectMessage');

        if (response.ok) {
            messageDiv.textContent = 'Proyecto actualizado exitosamente.';
            messageDiv.className = 'message success';
            document.getElementById('updateProjectForm').reset();
            loadProjectsForUpdate();
        } else {
            const errorText = await response.text();
            let errorMessage = 'Ocurrió un error al procesar la solicitud';

            try {
                const errorData = JSON.parse(errorText);
                // Usar el mensaje principal del ErrorResponse
                errorMessage = errorData.message || errorMessage;
            } catch {
                //Si la respuesta no es JSON valido, se muestra un mensaje generico.
                errorMessage = 'Ocurrió un error al procesar la solicitud';
            }

            messageDiv.textContent = errorMessage;
            messageDiv.className = 'message error';
        }
    } catch (error) {
        document.getElementById('updateProjectMessage').textContent = 'Error interno de conexión (' + error.message + ').';
        document.getElementById('updateProjectMessage').className = 'message error';
    }
});

//Logica de formulario para actualizar tarea.

document.getElementById('updateTaskForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const taskId = document.getElementById('updateTaskSelect').value;
    const projectId = document.getElementById('updateTaskProjectSelect').value;
    const taskData = {
        projectId: projectId,
        title: document.getElementById('updateTaskTitle').value,
        description: document.getElementById('updateTaskDescription').value,
        status: parseInt(document.getElementById('updateTaskStatus').value),
        priority: parseInt(document.getElementById('updateTaskPriority').value),
        dueDate: document.getElementById('updateTaskDueDate').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/taskitems/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
        });

        const messageDiv = document.getElementById('updateTaskMessage');

        if (response.ok) {
            messageDiv.textContent = 'Tarea actualizada exitosamente.';
            messageDiv.className = 'message success';
            document.getElementById('updateTaskForm').reset();
            loadProjectsForUpdate();
        } else {
            const errorText = await response.text();
            let errorMessage = 'Ocurrió un error al procesar la solicitud';

            try {
                const errorData = JSON.parse(errorText);
                // Usar el mensaje principal del ErrorResponse
                errorMessage = errorData.message || errorMessage;
            } catch {
                //Si la respuesta no es JSON valido, se muestra un mensaje generico.
                errorMessage = 'Ocurrió un error al procesar la solicitud';
            }

            messageDiv.textContent = errorMessage;
            messageDiv.className = 'message error';
        }
    } catch (error) {
        document.getElementById('updateTaskMessage').textContent = 'Error interno de conexión (' + error.message + ').';
        document.getElementById('updateTaskMessage').className = 'message error';
    }
});

// Cargar proyectos cuando carga la pagina.

document.addEventListener('DOMContentLoaded', () => {
    loadProjectsForUpdate();
});
