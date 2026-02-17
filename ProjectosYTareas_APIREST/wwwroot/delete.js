const API_BASE_URL = 'http://localhost:5092/api';

// Variable global para almacenar tareas actuales del proyecto seleccionado
let currentProjectTasks = [];

//Logica para cargar proyectos en ambos dropdowns.

async function loadProjectsForDelete() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        const projects = await response.json();

        //Dropdown para seleccionar proyecto a eliminar.
        const selectProject = document.getElementById('deleteProjectSelect');
        selectProject.innerHTML = '<option value="">Selecciona un proyecto...</option>';

        //Dropdown de proyecto para tareas.
        const selectTaskProject = document.getElementById('deleteTaskProjectSelect');
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

async function loadTasksByProjectIdForDelete(projectId) {
    try {
        const response = await fetch(`${API_BASE_URL}/taskitems/project/${projectId}`);
        const tasks = await response.json();

        const selectTask = document.getElementById('deleteTaskSelect');
        selectTask.innerHTML = '<option value="">Selecciona una tarea...</option>';

        tasks.forEach(task => {
            const option = document.createElement('option');
            option.value = task.id;
            option.textContent = task.title;
            selectTask.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar tareas: ', error);
    }
}

//Carga de datos actuales para visualizar contenido de Proyecto antes de eliminarlo.

const deleteProjectSelect = document.getElementById('deleteProjectSelect');
if (deleteProjectSelect) {
    deleteProjectSelect.addEventListener('change', async (e) => {
        const projectId = e.target.value;
        if (!projectId) {
            currentProjectTasks = [];
            return;
        }

        try {
            //Cargar las tareas del proyecto para validacion.
            const tasksResponse = await fetch(`${API_BASE_URL}/taskitems/project/${projectId}`);
            if (!tasksResponse.ok) {
                console.error('Error al cargar tareas del proyecto');
                currentProjectTasks = [];
                return;
            }
            currentProjectTasks = await tasksResponse.json();
        } catch (error) {
            console.error('Error al cargar proyecto: ', error);
            currentProjectTasks = [];
        }
    });
}

//Carga de tareas cuando se selecciona un proyecto.

const deleteTaskProjectSelect = document.getElementById('deleteTaskProjectSelect');
if (deleteTaskProjectSelect) {
    deleteTaskProjectSelect.addEventListener('change', (e) => {
        const projectId = e.target.value;
        if (!projectId) {
            const deleteTaskSelect = document.getElementById('deleteTaskSelect');
            if (deleteTaskSelect) {
                deleteTaskSelect.innerHTML = '<option value="">Selecciona una tarea...</option>';
            }
            return;
        }
        loadTasksByProjectIdForDelete(projectId);
    });
}

//Carga de datos actuales para visualizar contenido de Tarea antes de eliminarlo.

const deleteTaskSelect = document.getElementById('deleteTaskSelect');
if (deleteTaskSelect) {
    deleteTaskSelect.addEventListener('change', (e) => {
        //Solo se necesita para futuras extensiones, por ahora no hace nada
    });
}

//Logica de formulario para eliminar proyecto.

const deleteProjectForm = document.getElementById('deleteProjectForm');
if (deleteProjectForm) {
    deleteProjectForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const projectId = document.getElementById('deleteProjectSelect').value;
        const messageDiv = document.getElementById('deleteProjectMessage');

        if (!messageDiv) {
            console.error('Element deleteProjectMessage not found');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                messageDiv.textContent = 'Proyecto eliminado exitosamente.';
                messageDiv.className = 'message success';
                deleteProjectForm.reset();
                loadProjectsForDelete();
            } else {
                const errorText = await response.text();
                let errorMessage = 'Ocurrió un error al procesar la solicitud';

                try {
                    const errorData = JSON.parse(errorText);
                    //Usar el mensaje principal del ErrorResponse.
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    //Si la respuesta no es JSON valido, se muestra un mensaje generico.
                    errorMessage = 'Ocurrió un error al procesar la solicitud';
                }

                messageDiv.textContent = errorMessage;
                messageDiv.className = 'message error';
            }
        } catch (error) {
            messageDiv.textContent = 'Error interno de conexión (' + error.message + ').';
            messageDiv.className = 'message error';
        }
    });
}

//Logica de formulario para eliminar tarea.

const deleteTaskForm = document.getElementById('deleteTaskForm');
if (deleteTaskForm) {
    deleteTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const taskId = document.getElementById('deleteTaskSelect').value;
        const messageDiv = document.getElementById('deleteTaskMessage');

        if (!messageDiv) {
            console.error('Element deleteTaskMessage not found');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/taskitems/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                messageDiv.textContent = 'Tarea eliminada exitosamente.';
                messageDiv.className = 'message success';
                deleteTaskForm.reset();
                loadProjectsForDelete();
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
            messageDiv.textContent = 'Error interno de conexión (' + error.message + ').';
            messageDiv.className = 'message error';
        }
    });
}

//Cargar proyectos cuando carga la pagina.

document.addEventListener('DOMContentLoaded', () => {
    loadProjectsForDelete();
});
