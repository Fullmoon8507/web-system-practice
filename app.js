const STORAGE_KEY = 'todos-v1';
let filter = 'all';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function save(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

let todos = load();

function render() {
  const list = document.getElementById('todoList');
  const visible = todos.filter(t =>
    filter === 'all' ? true : filter === 'done' ? t.done : !t.done
  );

  if (visible.length === 0) {
    list.innerHTML = '<li class="empty">タスクがありません</li>';
  } else {
    list.innerHTML = visible.map(t => `
      <li data-id="${t.id}">
        <input type="checkbox" ${t.done ? 'checked' : ''} aria-label="完了切替" />
        <span class="todo-text ${t.done ? 'done' : ''}">${escHtml(t.text)}</span>
        <button class="delete-btn" aria-label="削除">✕</button>
      </li>
    `).join('');
  }

  const remaining = todos.filter(t => !t.done).length;
  document.getElementById('counter').textContent =
    `残り ${remaining} / ${todos.length} 件`;
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
          .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function addTodo() {
  const input = document.getElementById('newTodo');
  const text = input.value.trim();
  if (!text) { input.focus(); return; }
  todos.unshift({ id: Date.now(), text, done: false });
  save(todos);
  render();
  input.value = '';
  input.focus();
}

document.getElementById('addBtn').addEventListener('click', addTodo);

document.getElementById('newTodo').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTodo();
});

document.getElementById('todoList').addEventListener('click', e => {
  const li = e.target.closest('li[data-id]');
  if (!li) return;
  const id = Number(li.dataset.id);

  if (e.target.matches('input[type="checkbox"]')) {
    const todo = todos.find(t => t.id === id);
    if (todo) { todo.done = e.target.checked; save(todos); render(); }
  }

  if (e.target.matches('.delete-btn')) {
    todos = todos.filter(t => t.id !== id);
    save(todos);
    render();
  }
});

document.querySelector('.filters').addEventListener('click', e => {
  if (!e.target.dataset.filter) return;
  filter = e.target.dataset.filter;
  document.querySelectorAll('.filters button').forEach(b =>
    b.classList.toggle('active', b.dataset.filter === filter)
  );
  render();
});

document.getElementById('clearDone').addEventListener('click', () => {
  todos = todos.filter(t => !t.done);
  save(todos);
  render();
});

render();
