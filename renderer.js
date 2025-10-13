// 待办事项数组
let todos = [];

// DOM元素
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const totalTodosEl = document.getElementById('totalTodos');
const completedTodosEl = document.getElementById('completedTodos');
const closeBtn = document.getElementById('closeBtn');
const pinBtn = document.getElementById('pinBtn');

// 排序待办事项：未完成的在前，已完成的在后
function sortTodos() {
  todos.sort((a, b) => {
    if (a.completed !== b.completed) {
      // 未完成的排在前面（completed: false < true）
      return a.completed - b.completed;
    }

    if (a.completed) {
      // 已完成事项：保持创建顺序（id 较小的在前）
      return a.id - b.id;
    }

    // 未完成事项：新的（id 更大）排在前面
    return b.id - a.id;
  });
}

// 初始化：加载已保存的待办事项
async function init() {
  todos = await window.electronAPI.loadTodos();
  // 加载后也排序一次，确保顺序正确
  sortTodos();
  renderTodos();
  updateStats();
}

// 渲染待办事项列表
function renderTodos() {
  todoList.innerHTML = '';
  emptyState.classList.toggle('show', todos.length === 0);
  
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <input 
        type="checkbox" 
        class="todo-checkbox" 
        ${todo.completed ? 'checked' : ''}
        data-index="${index}"
      >
      <span class="todo-text">${escapeHtml(todo.text)}</span>
      <button class="delete-btn" data-index="${index}">删除</button>
    `;
    
    todoList.appendChild(li);
  });
}

// 添加待办事项
async function addTodo() {
  const text = todoInput.value.trim();
  
  if (!text) {
    todoInput.focus();
    return;
  }
  
  todos.push({
    id: Date.now(),
    text: text,
    completed: false
  });
  
  // 排序，确保新事项排在未完成事项的最前面，已完成事项的前面
  sortTodos();
  
  todoInput.value = '';
  todoInput.focus();
  
  await window.electronAPI.saveTodos(todos);
  renderTodos();
  updateStats();
}

// 切换完成状态
async function handleToggleComplete(e) {
  const index = parseInt(e.target.dataset.index);
  todos[index].completed = !todos[index].completed;
  
  // 排序：未完成的在前，已完成的在后
  sortTodos();
  
  await window.electronAPI.saveTodos(todos);
  renderTodos();
  updateStats();
}

// 删除待办事项
async function handleDelete(e) {
  const index = parseInt(e.target.dataset.index);
  todos.splice(index, 1);
  
  await window.electronAPI.saveTodos(todos);
  renderTodos();
  updateStats();
}

// 更新统计信息
function updateStats() {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  
  totalTodosEl.textContent = `总计: ${total}`;
  completedTodosEl.textContent = `已完成: ${completed}`;
}

// HTML转义（防止XSS）
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 事件委托：待办事项列表事件
todoList.addEventListener('change', (e) => {
  if (e.target.classList.contains('todo-checkbox')) {
    handleToggleComplete(e);
  }
});

todoList.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    handleDelete(e);
  }
});

// 添加待办事项事件
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

// 关闭窗口
closeBtn.addEventListener('click', () => {
  window.electronAPI.closeWindow();
});

// 置顶功能
let isPinned = false;
pinBtn.addEventListener('click', async () => {
  isPinned = !isPinned;
  await window.electronAPI.toggleAlwaysOnTop(isPinned);
  pinBtn.classList.toggle('pinned', isPinned);
});

// 页面加载时初始化
init();

