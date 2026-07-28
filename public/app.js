let tasks = [];

async function loadTasks() {
  const res = await fetch('/api/tasks');
  tasks = await res.json();
  renderTasks();
}

function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  document.getElementById('ring').style.setProperty('--pct', pct);
  document.getElementById('progressText').innerHTML =
    `<strong>${done}</strong> de ${total} completadas`;
}

function renderTasks() {
  const filterVal = document.getElementById('filter').value.toLowerCase();
  const list = document.getElementById('list');
  const empty = document.getElementById('emptyState');
  list.innerHTML = '';

  const filtered = tasks.filter(t => t.title.toLowerCase().includes(filterVal));
  empty.style.display = tasks.length === 0 ? 'block' : 'none';

  filtered.forEach(t => {
    const li = document.createElement('li');
    li.className = t.done ? 'done' : '';
    li.innerHTML = `
      <span class="check" onclick="toggleDone(${t.id}, ${!t.done})">${t.done ? '✓' : ''}</span>
      <span class="task-text" onclick="toggleDone(${t.id}, ${!t.done})">${t.title}</span>
      <span class="actions">
        <button class="icon-btn" onclick="editTask(${t.id}, '${t.title.replace(/'/g, "\\'")}')">✏️</button>
        <button class="icon-btn del" onclick="deleteTask(${t.id})">🗑️</button>
      </span>`;
    list.appendChild(li);
  });

  updateProgress();
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

document.getElementById('newTask').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

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
