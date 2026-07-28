let tasks = [];

async function loadTasks() {
  const res = await fetch('/api/tasks');
  tasks = await res.json();
  renderTasks();
}

function renderTasks() {
  const filterVal = document.getElementById('filter').value.toLowerCase();
  const list = document.getElementById('list');
  list.innerHTML = '';
  tasks
    .filter(t => t.title.toLowerCase().includes(filterVal))
    .forEach(t => {
      const li = document.createElement('li');
      li.className = t.done ? 'done' : '';
      li.innerHTML = `
        <span onclick="toggleDone(${t.id}, ${!t.done})">${t.title}</span>
        <span>
          <button onclick="editTask(${t.id}, '${t.title}')">✏️</button>
          <button onclick="deleteTask(${t.id})">🗑️</button>
        </span>`;
      list.appendChild(li);
    });
}

async function addTask() {
  const input = document.getElementById('newTask');
  if (!input.value.trim()) return;
  await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: input.value })
  });
  input.value = '';
  loadTasks();
}

async function toggleDone(id, done) {
  const t = tasks.find(x => x.id === id);
  await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: t.title, done })
  });
  loadTasks();
}

async function editTask(id, oldTitle) {
  const newTitle = prompt('Editar tarea:', oldTitle);
  if (newTitle === null) return;
  const t = tasks.find(x => x.id === id);
  await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: newTitle, done: t.done })
  });
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  loadTasks();
}

loadTasks();
