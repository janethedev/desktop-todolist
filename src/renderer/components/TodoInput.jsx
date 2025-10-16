import { useState } from 'react';
import { Input, Button, Space } from 'antd';
import { StarOutlined, StarFilled, PlusOutlined } from '@ant-design/icons';

function TodoInput({ onAddTodo, isImportant, onToggleImportant }) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const text = inputValue.trim();
    if (text) {
      onAddTodo(text);
      setInputValue('');
    }
  };

  return (
    <div className="input-section">
      <Space.Compact style={{ width: '100%' }}>
        <Button
          icon={isImportant ? <StarFilled /> : <StarOutlined />}
          type={isImportant ? 'primary' : 'default'}
          onClick={onToggleImportant}
          title="标记为重要"
          danger={isImportant}
          style={{ 
            color: isImportant ? '#faad14' : undefined,
            borderColor: isImportant ? '#faad14' : undefined,
            background: isImportant ? '#fffbe6' : undefined
          }}
        />
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={handleAdd}
          placeholder="添加新任务..."
          maxLength={200}
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          
        </Button>
      </Space.Compact>
    </div>
  );
}

export default TodoInput;

