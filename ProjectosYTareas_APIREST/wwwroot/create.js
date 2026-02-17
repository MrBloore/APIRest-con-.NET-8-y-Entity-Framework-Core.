const API_BASE_URL = 'http://localhost:5092/api';

//Lógica de formulario de Proyecto.

document.getElementById('projectForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const projectData = {
        name: document.getElementById('projectName').value,
        description: document.getElementById('projectDescription').value
    };

    //POST para crear proyecto.
    try {
        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectData)
        });

        const messageDiv = document.getElementById('projectMessage');

        if (response.ok) {
            messageDiv.textContent = 'Proyecto creado exitosamente.';
            messageDiv.className = 'message success';
            document.getElementById('projectForm').reset();
            
            // Recargar dropdown de proyectos.
            loadProjects();
        } else {
            messageDiv.textContent = 'Error al crear proyecto.';
            messageDiv.className = 'message error';
        }
    } catch (error) {
        document.getElementById('projectMessage').textContent = 'Error interno de conexión (' + error.message + ').';
        document.getElementById('projectMessage').className = 'message error';
    }
});

//Logica de formulario de Tareas. Se incluye dropdown de proyectos existentes.

document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const projectId = document.getElementById('taskProject').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const today = new Date().toISOString().split('T')[0];

    // Validar que se haya seleccionado un proyecto.
    if (!projectId || projectId === '') {
        document.getElementById('taskMessage').textContent = 'Error: Debes seleccionar un proyecto.';
        document.getElementById('taskMessage').className = 'message error';
        return;
    }

    // Validacion de DueDate para que no sea en el pasado.
    if (dueDate < today) {
        document.getElementById('taskMessage').textContent = 'La fecha límite no puede ser en el pasado. Selecciona una fecha válida.';
        document.getElementById('taskMessage').className = 'message error';
        return;
    }

    const taskData = {
        projectId: projectId,
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        priority: parseInt(document.getElementById('taskPriority').value),
        dueDate: dueDate
    };

    try {
        const response = await fetch(`${API_BASE_URL}/taskitems`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
        });

        const messageDiv = document.getElementById('taskMessage');

        if (response.ok) {
            messageDiv.textContent = 'Tarea creada exitosamente.';
            messageDiv.className = 'message success';
            document.getElementById('taskForm').reset();
        } else {
            messageDiv.textContent = 'Error al crear tarea.';
            messageDiv.className = 'message error';
        }
    } catch (error) {
        document.getElementById('taskMessage').textContent = 'Error interno de conexión (' + error.message + ').';
        document.getElementById('taskMessage').className = 'message error';
    }
});

//DropDown de proyectos.

async function loadProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        const projects = await response.json();

        const select = document.getElementById('taskProject');
        select.innerHTML = '<option value="">Selecciona un proyecto...</option>';

        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar proyectos: ', error);
    }
}

// Cargar proyectos cuando carga la página.
document.addEventListener('DOMContentLoaded', () => {
    // Establecer fecha minima en el input (hoy).
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('taskDueDate').min = today;

    loadProjects();
});
