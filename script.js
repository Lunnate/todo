document.addEventListener('DOMContentLoaded', () => {
let todos = [];
let doneItems = [];
let taskIdCounter = 0;

const taskInput = document.querySelector('#taskInput');
const addBtn = document.querySelector('#addBtn');
const emptyState = document.querySelector('#emptyState');
const tasksSection = document.querySelector('#tasksSection');
const doneSection = document.querySelector('#doneSection');
const todoList = document.querySelector('#todoList');
const doneList = document.querySelector('#doneList');
const todoCount = document.querySelector('#todoCount');
const doneCount = document.querySelector('#doneCount');

function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('doneItems', JSON.stringify(doneItems));
    localStorage.setItem('taskIdCounter', taskIdCounter.toString());
}

function loadFromLocalStorage() {
    const savedTodos = localStorage.getItem('todos');
    const savedDoneItems = localStorage.getItem('doneItems');
    const savedCounter = localStorage.getItem('taskIdCounter');

    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    }

    if (savedDoneItems) {
        doneItems = JSON.parse(savedDoneItems);
    }

    if (savedCounter) {
        taskIdCounter = parseInt(savedCounter);
    }
}


function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') return;

    const newTask = {
        id: taskIdCounter++,
        text: taskText,
        completed: false
    };

    todos.push(newTask);
    taskInput.value = '';

    saveToLocalStorage();
    renderTasks();
    toggleTodoState();
}


function markAsDone(taskId) {
    const taskIndex = todos.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        const task = todos[taskIndex];
        task.completed = true;

        todos.splice(taskIndex, 1);
        doneItems.push(task);

        saveToLocalStorage();
        renderTasks();
        toggleTodoState();
    }
}


function removeTask(taskId, isDone = false) {
    if (isDone) {
        const taskIndex = doneItems.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            doneItems.splice(taskIndex, 1);
        }
    } else {
        const taskIndex = todos.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            todos.splice(taskIndex, 1);
        }
    }

    saveToLocalStorage();
    renderTasks();
    toggleTodoState();
}


function createTaskElement(task, isDone = false) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';

    const taskText = document.createElement('span');
    taskText.className = isDone ? 'task-text completed' : 'task-text';
    taskText.textContent = task.text;

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'task-buttons';

    if (!isDone) {
        const doneBtn = document.createElement('button');
        doneBtn.className = 'task-btn';
        doneBtn.innerHTML = '<img src="icons/done.png" alt="">';
        doneBtn.onclick = () => markAsDone(task.id);
        buttonsContainer.appendChild(doneBtn);
    }

    const removeBtn = document.createElement('button');
    removeBtn.className = 'task-btn';
    removeBtn.innerHTML = '<img src="icons/delete.png" alt="">';
    removeBtn.onclick = () => removeTask(task.id, isDone);
    buttonsContainer.appendChild(removeBtn);

    taskElement.appendChild(taskText);
    taskElement.appendChild(buttonsContainer);

    return taskElement;
}


function renderTasks() {
    todoList.innerHTML = '';
    doneList.innerHTML = '';


    todos.forEach(task => {
        const taskElement = createTaskElement(task);
        todoList.appendChild(taskElement);
    });


    doneItems.forEach(task => {
        const taskElement = createTaskElement(task, true);
        doneList.appendChild(taskElement);
    });

    todoCount.textContent = todos.length;
    doneCount.textContent = doneItems.length;
}


function toggleTodoState() {
    const hasTasks = todos.length > 0 || doneItems.length > 0;

    if (hasTasks) {
        emptyState.style.display = 'none';
        tasksSection.style.display = 'block';

        doneSection.style.display = doneItems.length > 0 ? 'block' : 'none';
    } else {
        emptyState.style.display = 'block';
        tasksSection.style.display = 'none';
    }
}


addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});


loadFromLocalStorage();
renderTasks();
toggleTodoState();
})