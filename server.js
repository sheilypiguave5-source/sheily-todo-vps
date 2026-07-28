`let tasks = [];

function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();

  if (!text) return;

  tasks.push({
    id: Date.now(),
    text
  });

  input.value = '';
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const nuevo = prompt('Editar tarea:', task.text);

  if (nuevo && nuevo.trim()) {
    task.text = nuevo.trim();
    renderTasks();
  }
}

function renderTasks() {
  const list = document.getElementById('taskList');
  const search = document.getElementById('search').value.toLowerCase();

  list.innerHTML = '';

  const filtradas = tasks.filter(t =>
    t.text.toLowerCase().includes(search)
  );

  filtradas.forEach(task => {
    list.innerHTML += \`
      <li>
        <span>\${task.text}</span>
        <div class="actions">
          <button class="edit" onclick="editTask(\${task.id})">✏️</button>
          <button class="delete" onclick="deleteTask(\${task.id})">🗑️</button>
        </div>
      </li>
    \`;
  });

  document.getElementById('total').textContent =
    tasks.length + (tasks.length === 1 ? ' tarea' : ' tareas');
}

document.getElementById('search').addEventListener('input', renderTasks);`
