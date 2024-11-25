const API_URL = 'https://js1-todo-api.vercel.app/api/todos?apikey=62287f40-3439-4630-872b-72815ccb1228';
const API_KEY = '62287f40-3439-4630-872b-72815ccb1228';

const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');

// Hämta todos vid sidladdning
async function fetchTodos() {
    const response = await fetch(API_URL, {
        headers: { Authorization: API_KEY }
    });
    const todos = await response.json();
    renderTodos(todos);
}

// Rendera todos
function renderTodos(todos) {
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <label>
                <input type="checkbox" class="checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}">
                <span>${todo.title}</span>
            </label>
            <button onclick="deleteTodo('${todo.id}', ${todo.completed})">Delete</button>
        `;
        todoList.appendChild(li);
    });

    document.querySelectorAll('.checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            toggleComplete(e.target);
        });
    });
}

//Lägg till ny todo
todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = todoInput.value.trim();
    if (!title) {
        alert('Todo text cannot be empty!');
        return;
    }
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            Authorization: API_KEY 
        },
        body: JSON.stringify({ title })
    });
    if (response.ok) {
        const newTodo = await response.json();
        fetchTodos();
    }
    todoInput.value = '';
});

// Ta bort  todo
async function deleteTodo(id, completed) {
    if (!completed) {
        modal.classList.remove('hidden');
        return;
    }
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: API_KEY }
    });
    fetchTodos();
}

// Klarmarkera todo med checkbox
async function toggleComplete(checkbox) {
    const id = checkbox.dataset.id;
    const completed = checkbox.checked;

    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json', 
            Authorization: API_KEY 
        },
        body: JSON.stringify({ completed })
    });

    fetchTodos();
}

// Stäng modal
closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
});


fetchTodos();