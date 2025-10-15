import { useState } from 'react';
import { Checkbox, Input } from 'antd';

function TodoList({ todos, onToggleComplete, onDelete, onEdit }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleDoubleClick = (todo) => {
    setEditingId(todo.id);
    setEditValue(todo.text);
  };

  const handleSaveEdit = (id) => {
    const newText = editValue.trim();
    if (newText) {
      onEdit(id, newText);
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      handleSaveEdit(id);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  if (todos.length === 0) {
    return (
      <div className="empty-state show">
        <p>暂无待办事项</p>
        <p className="subtitle">添加你的第一个任务</p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className={`todo-item ${todo.completed ? 'completed' : ''} ${
            todo.important ? 'important' : ''
          }`}
        >
          <Checkbox
            checked={todo.completed}
            onChange={() => onToggleComplete(todo.id)}
            className="todo-checkbox"
          />
          {todo.important && (
            <span className="important-badge" title="重要">
              ⭐
            </span>
          )}
          {editingId === todo.id ? (
            <div className="edit-container">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, todo.id)}
                maxLength={200}
                className="todo-edit-input"
                autoFocus
              />
              <div className="edit-actions-panel">
                <button
                  className="save-btn"
                  onClick={() => handleSaveEdit(todo.id)}
                  title="保存 (Enter)"
                >
                  ✓
                </button>
                <button
                  className="cancel-btn"
                  onClick={handleCancelEdit}
                  title="取消 (Esc)"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <>
              <span
                className="todo-text"
                onDoubleClick={() => handleDoubleClick(todo)}
              >
                {todo.text}
              </span>
              <button
                className="edit-btn"
                onClick={() => handleDoubleClick(todo)}
                title="编辑"
              >
                ✏️
              </button>
              <button
                className="delete-btn"
                onClick={() => onDelete(todo.id)}
                title="删除"
              >
                🗑️
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default TodoList;

