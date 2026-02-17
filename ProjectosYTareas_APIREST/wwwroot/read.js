const API_BASE_URL = 'http://localhost:5092/api';

//Variable global para almacenar todas las tareas cargadas
let allLoadedTasks = [];

//Logica para cargar todos los proyectos en el dropdown.

async function loadProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        const projects = await response.json();

        const selectProject = document.getElementById('projectSelect');
        selectProject.innerHTML = '<option value="">Selecciona un proyecto...</option>';

        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            selectProject.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar proyectos: ', error);
    }
}

//Logica para mostrar detalles del proyecto seleccionado.

async function displayProjectDetails(projectId) {
    try {
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}`);
        
        if (!response.ok) {
            console.error('Error al obtener detalles del proyecto');
            return;
        }

        const project = await response.json();

        //Mapear el estado del proyecto a texto legible.
        const statusMap = {
            1: 'Activo',
            2: 'Finalizado'
        };

        document.getElementById('projectName').textContent = project.name;
        document.getElementById('projectId').textContent = project.id;
        document.getElementById('projectDescription').textContent = project.description;
        document.getElementById('projectStatus').textContent = statusMap[project.status] || project.status;
        document.getElementById('projectCreatedAt').textContent = project.createdAt;
        document.getElementById('projectTaskCount').textContent = project.taskItemsCount;

        document.getElementById('projectDetailsContainer').style.display = 'block';

        //Cargar las tareas del proyecto.
        await loadProjectTasks(projectId);
    } catch (error) {
        console.error('Error al cargar detalles del proyecto: ', error);
    }
}

//Logica para cargar y mostrar las tareas de un proyecto específico.

async function loadProjectTasks(projectId) {
    try {
        const response = await fetch(`${API_BASE_URL}/taskitems/project/${projectId}`);

        if (!response.ok) {
            console.error('Error al obtener tareas del proyecto');
            return;
        }

        const tasks = await response.json();

        const tasksListContainer = document.getElementById('tasksListContainer');
        const noTasksMessage = document.getElementById('noTasksMessage');
        const taskSelect = document.getElementById('taskSelect');

        if (tasks.length === 0) {
            document.getElementById('projectTasksContainer').style.display = 'none';
            noTasksMessage.style.display = 'block';
            taskSelect.innerHTML = '<option value="">Selecciona una tarea...</option>';
            // Mostrar 0% de progreso si no hay tareas
            document.getElementById('projectProgressBar').style.width = '0%';
            document.getElementById('projectProgressPercentage').textContent = '0%';
            return;
        }

        // Calcular porcentaje de avance.
        const completedTasks = tasks.filter(task => task.status === 3).length;
        const totalTasks = tasks.length;
        const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

        // Actualizar barra de progreso.
        document.getElementById('projectProgressBar').style.width = progressPercentage + '%';
        document.getElementById('projectProgressPercentage').textContent = progressPercentage + '%';

        //Mostrar container de tareas del proyecto.
        document.getElementById('projectTasksContainer').style.display = 'block';
        noTasksMessage.style.display = 'none';

        //Actualizar el dropdown de tareas.
        taskSelect.innerHTML = '<option value="">Selecciona una tarea...</option>';

        //Generar lista HTML de tareas.
        tasksListContainer.innerHTML = '<h4>Lista de Tareas: <br></h4>';
        const tasksList = document.createElement('ul');
        tasksList.style.listStyle = 'none';
        tasksList.style.padding = '0';

        const statusMap = {
            1: 'Por Hacer',
            2: 'En Progreso',
            3: 'Completada'
        };

        const priorityMap = {
            1: 'Baja',
            2: 'Media',
            3: 'Alta'
        };

        tasks.forEach(task => {
            //Agregar a dropdown.
            const option = document.createElement('option');
            option.value = task.id;
            option.textContent = task.title;
            taskSelect.appendChild(option);

            //Crear elemento de lista.
            const listItem = document.createElement('li');
            listItem.style.padding = '10px';
            listItem.style.marginBottom = '10px';
            listItem.style.backgroundColor = '#f9f9f9';
            listItem.style.borderLeft = '4px solid #007bff';
            listItem.style.borderRadius = '4px';

            listItem.innerHTML = `
                <strong>${task.title}</strong>
                <div style="font-size: 0.9em; color: #666; margin-top: 5px;">
                    <div>Estado: ${statusMap[task.status] || task.status}</div>
                    <div>Prioridad: ${priorityMap[task.priority] || task.priority}</div>
                    <div>Fecha Límite: ${task.dueDate}</div>
                </div>
            `;

            tasksList.appendChild(listItem);
        });

        tasksListContainer.appendChild(tasksList);
    } catch (error) {
        console.error('Error al cargar tareas del proyecto: ', error);
    }
}

//Logica para mostrar detalles de una tarea seleccionada.

async function displayTaskDetails(taskId) {
    try {
        const response = await fetch(`${API_BASE_URL}/taskitems/${taskId}`);
        
        if (!response.ok) {
            console.error('Error al obtener detalles de la tarea');
            return;
        }

        const task = await response.json();

        //Mapear estados y prioridades a texto legible.
        const statusMap = {
            1: 'Por Hacer',
            2: 'En Progreso',
            3: 'Completada'
        };

        const priorityMap = {
            1: 'Baja',
            2: 'Media',
            3: 'Alta'
        };

        document.getElementById('taskTitle').textContent = task.title;
        document.getElementById('taskId').textContent = task.id;
        document.getElementById('taskProjectName').textContent = task.projectName || 'Proyecto no especificado';
        document.getElementById('taskDescription').textContent = task.description;
        document.getElementById('taskStatus').textContent = statusMap[task.status] || task.status;
        document.getElementById('taskPriority').textContent = priorityMap[task.priority] || task.priority;
        document.getElementById('taskDueDate').textContent = task.dueDate;
        document.getElementById('taskCreatedAt').textContent = task.createdAt;

        document.getElementById('taskDetailsContainer').style.display = 'block';
    } catch (error) {
        console.error('Error al cargar detalles de la tarea: ', error);
    }
}


//Funcion auxiliar para verificar si una tarea esta vencida.
function isTaskOverdue(task) {
    //Si la tarea ya esta completada, no está vencida.
    if (task.status === 3) {
        return false;
    }

    //Obtener la fecha actual sin hora.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    //Parsear la fecha limite (formato: YYYY-MM-DD).
    const dueDate = new Date(task.dueDate + 'T00:00:00');

    //Una tarea esta vencida si su fecha límite es menor a hoy.
    return dueDate < today;
}

//Funcion para renderizar las tareas filtradas.
function renderFilteredTasks(tasksToRender) {
    const allTasksListContainer = document.getElementById('allTasksListContainer');

    if (tasksToRender.length === 0) {
        allTasksListContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No hay tareas que coincidan con los filtros seleccionados.</p>';
        return;
    }

    //Generar lista HTML de tareas filtradas.
    allTasksListContainer.innerHTML = '<h4>Lista de Tareas:</h4>';
    const tasksList = document.createElement('ul');
    tasksList.style.listStyle = 'none';
    tasksList.style.padding = '0';

    const statusMap = {
        1: 'Por Hacer',
        2: 'En Progreso',
        3: 'Completada'
    };

    const priorityMap = {
        1: 'Baja',
        2: 'Media',
        3: 'Alta'
    };

    tasksToRender.forEach(task => {
        const listItem = document.createElement('li');
        listItem.style.padding = '15px';
        listItem.style.marginBottom = '15px';
        listItem.style.backgroundColor = '#f9f9f9';
        listItem.style.borderLeft = '4px solid #28a745';
        listItem.style.borderRadius = '4px';
        listItem.style.cursor = 'pointer';
        listItem.style.transition = 'background-color 0.3s';

        //Cambiar color si esta vencida.
        if (isTaskOverdue(task)) {
            listItem.style.borderLeft = '4px solid #dc3545';
            listItem.style.backgroundColor = '#fff5f5';
        }

        listItem.onmouseover = () => listItem.style.backgroundColor = '#f0f0f0';
        listItem.onmouseout = () => {
            listItem.style.backgroundColor = isTaskOverdue(task) ? '#fff5f5' : '#f9f9f9';
        };

        //Hacer el elemento clickeable para mostrar detalles.
        listItem.onclick = () => {
            document.getElementById('taskSelect').value = task.id;
            displayTaskDetails(task.id);
            document.getElementById('taskSelect').dispatchEvent(new Event('change'));
        };

        //Mostrar indicador si esta vencida.
        const overdueIndicator = isTaskOverdue(task) ? '<span style="color: #dc3545; font-weight: bold;"> [VENCIDA]</span>' : '';

        listItem.innerHTML = `
            <strong>${task.title}${overdueIndicator}</strong>
            <div style="font-size: 0.9em; color: #666; margin-top: 5px;">
                <div>Proyecto: ${task.projectName || 'Proyecto no especificado'}</div>
                <div>Estado: ${statusMap[task.status] || task.status}</div>
                <div>Prioridad: ${priorityMap[task.priority] || task.priority}</div>
                <div>Fecha Límite: ${task.dueDate}</div>
            </div>
        `;

        tasksList.appendChild(listItem);
    });

    allTasksListContainer.appendChild(tasksList);
}

//Funcion para aplicar filtros a las tareas cargadas.

function applyFilters() {
    const priorityFilter = document.getElementById('taskPriorityFilter').value;
    const overdueFilter = document.getElementById('overduedTasksFilter').value;

    let filteredTasks = allLoadedTasks;

    //Filtrar por prioridad.
    if (priorityFilter) {
        filteredTasks = filteredTasks.filter(task => task.priority === parseInt(priorityFilter));
    }

    //Filtrar por tareas vencidas/activas.
    if (overdueFilter === 'overdue') {
        filteredTasks = filteredTasks.filter(task => isTaskOverdue(task));
    } else if (overdueFilter === 'active') {
        filteredTasks = filteredTasks.filter(task => !isTaskOverdue(task));
    }

    renderFilteredTasks(filteredTasks);
}

//Logica para cargar y mostrar todas las tareas disponibles.

async function loadAllTasks() {
    try {
        const response = await fetch(`${API_BASE_URL}/taskitems`);

        if (!response.ok) {
            console.error('Error al obtener todas las tareas');
            return;
        }

        allLoadedTasks = await response.json();

        if (allLoadedTasks.length === 0) {
            document.getElementById('allTasksListContainer').innerHTML = '<p>No hay tareas registradas.</p>';
            return;
        }

        //Mostrar los filtros.
        document.getElementById('globalTasksFiltersContainer').style.display = 'block';

        //Renderizar todas las tareas inicialmente.
        renderFilteredTasks(allLoadedTasks);
    } catch (error) {
        console.error('Error al cargar todas las tareas: ', error);
    }
}

//Event listeners para cambios en los dropdowns.

document.getElementById('projectSelect').addEventListener('change', async (e) => {
    const projectId = e.target.value;
    if (!projectId) {
        document.getElementById('projectDetailsContainer').style.display = 'none';
        document.getElementById('projectTasksContainer').style.display = 'none';
        document.getElementById('noTasksMessage').style.display = 'none';
        document.getElementById('taskSelect').innerHTML = '<option value="">Selecciona una tarea...</option>';
        document.getElementById('taskDetailsContainer').style.display = 'none';
        return;
    }
    await displayProjectDetails(projectId);
});

document.getElementById('taskSelect').addEventListener('change', async (e) => {
    const taskId = e.target.value;
    if (!taskId) {
        document.getElementById('taskDetailsContainer').style.display = 'none';
        return;
    }
    await displayTaskDetails(taskId);
});

document.getElementById('loadAllTasksBtn').addEventListener('click', () => {
    const allTasksContainer = document.getElementById('allTasksContainer');

    if (allTasksContainer.style.display === 'none') {
        loadAllTasks();
        allTasksContainer.style.display = 'block';
        document.getElementById('loadAllTasksBtn').textContent = 'Ocultar Todas las Tareas Globales';
        document.getElementById('loadAllTasksBtn').style.backgroundColor = '#dc3545';
    } else {
        allTasksContainer.style.display = 'none';
        document.getElementById('loadAllTasksBtn').textContent = 'Cargar Todas las Tareas Globales';
        document.getElementById('loadAllTasksBtn').style.backgroundColor = '#28a745';
        //Limpiar filtros.
        document.getElementById('taskPriorityFilter').value = '';
        document.getElementById('overduedTasksFilter').value = 'all';
        document.getElementById('globalTasksFiltersContainer').style.display = 'none';
    }
});

//Event listeners para los filtros.

document.getElementById('taskPriorityFilter').addEventListener('change', applyFilters);
document.getElementById('overduedTasksFilter').addEventListener('change', applyFilters);

//Cargar proyectos cuando carga la página.

document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
});
