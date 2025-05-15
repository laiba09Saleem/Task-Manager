document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const taskCount = document.getElementById('task-count');
    const clearCompletedBtn = document.getElementById('clear-completed');
    
    const API_URL = 'http://localhost:5000/api';
    let currentFilter = 'all';

    // Initialize the app
    function init() {
        fetchTasks();
        addBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTask();
        });
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                fetchTasks();
            });
        });
        
        clearCompletedBtn.addEventListener('click', clearCompleted);
    }

    // Fetch tasks from the API
    async function fetchTasks() {
        try {
            const response = await fetch(`${API_URL}/tasks?filter=${currentFilter}`);
            const tasks = await response.json();
            renderTasks(tasks);
            updateTaskCount();
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    // Add a new task
    async function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            try {
                const response = await fetch(`${API_URL}/tasks`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text })
                });
                
                if (response.ok) {
                    taskInput.value = '';
                    fetchTasks();
                }
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
    }

    // Render tasks
    function renderTasks(tasks) {
        taskList.innerHTML = '';
        
        if (tasks.length === 0) {
            taskList.innerHTML = '<p class="no-tasks">No tasks found</p>';
            return;
        }
        
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            taskItem.dataset.id = task.id;
            
            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            `;
            
            const checkbox = taskItem.querySelector('.task-checkbox');
            const deleteBtn = taskItem.querySelector('.delete-btn');
            const taskText = taskItem.querySelector('.task-text');
            
            checkbox.addEventListener('change', () => toggleTaskComplete(task.id, checkbox.checked));
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
            taskText.addEventListener('dblclick', () => editTask(task.id, taskText));
            
            taskList.appendChild(taskItem);
        });
    }

    // Toggle task completion status
    async function toggleTaskComplete(id, completed) {
        try {
            await fetch(`${API_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed })
            });
            
            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }

    // Delete a task
    async function deleteTask(id) {
        try {
            await fetch(`${API_URL}/tasks/${id}`, {
                method: 'DELETE'
            });
            
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    // Edit a task
    function editTask(id, taskTextElement) {
        const currentText = taskTextElement.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.className = 'edit-input';
        
        taskTextElement.replaceWith(input);
        input.focus();
        
        async function saveEdit() {
            const newText = input.value.trim();
            if (newText) {
                try {
                    await fetch(`${API_URL}/tasks/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ text: newText })
                    });
                    
                    fetchTasks();
                } catch (error) {
                    console.error('Error updating task:', error);
                }
            } else {
                fetchTasks();
            }
        }
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') saveEdit();
        });
    }

    // Clear completed tasks
    async function clearCompleted() {
        try {
            await fetch(`${API_URL}/tasks/clear-completed`, {
                method: 'DELETE'
            });
            
            fetchTasks();
        } catch (error) {
            console.error('Error clearing completed tasks:', error);
        }
    }

    // Update task counter
    async function updateTaskCount() {
        try {
            const response = await fetch(`${API_URL}/tasks?filter=active`);
            const activeTasks = await response.json();
            taskCount.textContent = `${activeTasks.length} ${activeTasks.length === 1 ? 'task' : 'tasks'} left`;
        } catch (error) {
            console.error('Error counting tasks:', error);
        }
    }

    // Initialize the app
    init();
});