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
const importantToggle = document.getElementById('importantToggle');

// 当前是否标记为重要
let isImportant = false;

// 排序待办事项：未完成的在前，已完成的在后，重要的在最前面
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

    // 未完成事项：重要的在前，然后按时间排序
    if (a.important !== b.important) {
      return b.important - a.important; // true > false，重要的在前
    }
    
    // 同等重要性：新的（id 更大）排在前面
    return b.id - a.id;
  });
}

// 初始化：加载已保存的待办事项
async function init() {
  todos = await window.electronAPI.loadTodos();
  
  // 向后兼容：为旧数据添加 important 字段
  todos = todos.map(todo => ({
    ...todo,
    important: todo.important || false
  }));
  
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
    li.className = `todo-item ${todo.completed ? 'completed' : ''} ${todo.important ? 'important' : ''}`;
    
    li.innerHTML = `
      <input 
        type="checkbox" 
        class="todo-checkbox" 
        ${todo.completed ? 'checked' : ''}
        data-index="${index}"
      >
      ${todo.important ? '<span class="important-badge" title="重要">⭐</span>' : ''}
      <span class="todo-text" data-index="${index}">${escapeHtml(todo.text)}</span>
      <button class="edit-btn" data-index="${index}" title="编辑">✏️</button>
      <button class="delete-btn" data-index="${index}" title="删除">🗑️</button>
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
    completed: false,
    important: isImportant
  });
  
  // 排序，确保新事项排在未完成事项的最前面，已完成事项的前面
  sortTodos();
  
  todoInput.value = '';
  todoInput.focus();
  
  // 重置重要性标记
  isImportant = false;
  importantToggle.classList.remove('active');
  
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

// 进入编辑模式
function enterEditMode(index) {
  const todoItem = todoList.children[index];
  const todoTextSpan = todoItem.querySelector('.todo-text');
  const editBtn = todoItem.querySelector('.edit-btn');
  const deleteBtn = todoItem.querySelector('.delete-btn');
  const currentText = todos[index].text;
  
  // 创建编辑容器
  const editContainer = document.createElement('div');
  editContainer.className = 'edit-container';
  
  // 创建编辑输入框
  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'todo-edit-input';
  editInput.value = currentText;
  editInput.maxLength = 200;
  editInput.dataset.index = index;
  
  // 创建浮动操作面板
  const actionsPanel = document.createElement('div');
  actionsPanel.className = 'edit-actions-panel';
  
  // 创建保存按钮（使用图标）
  const saveBtn = document.createElement('button');
  saveBtn.className = 'save-btn';
  saveBtn.innerHTML = '✓';
  saveBtn.title = '保存 (Enter)';
  saveBtn.dataset.index = index;
  
  // 创建取消按钮（使用图标）
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'cancel-btn';
  cancelBtn.innerHTML = '✕';
  cancelBtn.title = '取消 (Esc)';
  cancelBtn.dataset.index = index;
  
  actionsPanel.appendChild(saveBtn);
  actionsPanel.appendChild(cancelBtn);
  
  editContainer.appendChild(editInput);
  editContainer.appendChild(actionsPanel);
  
  // 替换文本为编辑容器
  todoTextSpan.replaceWith(editContainer);
  editInput.focus();
  editInput.select();
  
  // 隐藏编辑和删除按钮
  editBtn.style.display = 'none';
  deleteBtn.style.display = 'none';
}

// 退出编辑模式
function exitEditMode(index, save = false) {
  const todoItem = todoList.children[index];
  const editInput = todoItem.querySelector('.todo-edit-input');
  
  if (!editInput) return;
  
  const newText = editInput.value.trim();
  
  // 如果保存且文本有效，更新数据
  if (save && newText) {
    todos[index].text = newText;
    window.electronAPI.saveTodos(todos);
  }
  
  // 重新渲染所有待办事项
  renderTodos();
  updateStats();
}

// 处理编辑按钮点击
function handleEdit(e) {
  const index = parseInt(e.target.dataset.index);
  enterEditMode(index);
}

// 处理保存按钮点击
async function handleSave(e) {
  const index = parseInt(e.target.dataset.index);
  exitEditMode(index, true);
}

// 处理取消按钮点击
function handleCancel(e) {
  const index = parseInt(e.target.dataset.index);
  exitEditMode(index, false);
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
  } else if (e.target.classList.contains('edit-btn')) {
    handleEdit(e);
  } else if (e.target.classList.contains('save-btn')) {
    handleSave(e);
  } else if (e.target.classList.contains('cancel-btn')) {
    handleCancel(e);
  }
});

// 双击任务文本进入编辑模式
todoList.addEventListener('dblclick', (e) => {
  if (e.target.classList.contains('todo-text')) {
    const index = parseInt(e.target.dataset.index);
    enterEditMode(index);
  }
});

// 编辑输入框键盘事件
todoList.addEventListener('keydown', (e) => {
  if (e.target.classList.contains('todo-edit-input')) {
    const index = parseInt(e.target.dataset.index);
    if (e.key === 'Enter') {
      exitEditMode(index, true);
    } else if (e.key === 'Escape') {
      exitEditMode(index, false);
    }
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

// 重要性切换
importantToggle.addEventListener('click', () => {
  isImportant = !isImportant;
  importantToggle.classList.toggle('active', isImportant);
});

// 页面加载时初始化
init();

