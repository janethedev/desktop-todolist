import { useState } from 'react';
import { List, Checkbox, Input, Button, Space, Typography, Empty } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, StarFilled } from '@ant-design/icons';

const { Text } = Typography;

function TodoList({ todos, onToggleComplete, onDelete, onEdit }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleStartEdit = (todo) => {
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

  if (todos.length === 0) {
    return (
      <div className="todo-list todo-list-empty">
        <Empty
          description={
            <div>
              <div>暂无待办事项</div>
              <Text type="secondary" style={{ fontSize: 12 }}>添加你的第一个任务</Text>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <List
      className="todo-list"
      dataSource={todos}
      renderItem={(todo) => (
        <List.Item
          className={todo.important ? 'todo-item-important' : ''}
          style={{ 
            padding: '6px 10px',
            marginBottom: '4px',
            border: '1px solid #f0f0f0',
            borderRadius: '4px',
            background: 'white'
          }}
        >
          <div className="todo-item-row">
            <div className="todo-item-left">
              <Checkbox
                checked={todo.completed}
                onChange={() => onToggleComplete(todo.id)}
              />
              {todo.important && (
                <StarFilled className="important-badge" style={{ color: '#faad14' }} />
              )}
              {editingId === todo.id ? (
                <div className="edit-compact">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onPressEnter={() => handleSaveEdit(todo.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    maxLength={200}
                    autoFocus
                    style={{ flex: 1, minWidth: 0 }}
                  />
                  <Button
                    type="primary"
                    size="small"
                    icon={<CheckOutlined />}
                    onClick={() => handleSaveEdit(todo.id)}
                    title="保存 (Enter)"
                  />
                  <Button
                    size="small"
                    icon={<CloseOutlined />}
                    onClick={handleCancelEdit}
                    title="取消 (Esc)"
                  />
                </div>
              ) : (
                <Text
                  className="todo-text"
                  delete={todo.completed}
                  type={todo.completed ? 'secondary' : undefined}
                  onDoubleClick={() => handleStartEdit(todo)}
                  style={{ flex: 1, cursor: 'pointer' }}
                >
                  {todo.text}
                </Text>
              )}
            </div>
            {editingId !== todo.id && (
              <div className="todo-item-actions">
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => handleStartEdit(todo)}
                  title="编辑"
                />
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => onDelete(todo.id)}
                  title="删除"
                />
              </div>
            )}
          </div>
        </List.Item>
      )}
    />
  );
}

export default TodoList;

