import { useState } from 'react';
import { Input, Button } from 'antd';

function TodoInput({ onAddTodo, isImportant, onToggleImportant }) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const text = inputValue.trim();
    if (text) {
      onAddTodo(text);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="input-section">
      <button
        className={`important-toggle ${isImportant ? 'active' : ''}`}
        onClick={onToggleImportant}
        title="标记为重要"
      >
        ⭐
      </button>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="添加新任务..."
        maxLength={200}
        className="todo-input"
      />
      <Button type="primary" onClick={handleAdd} className="add-btn">
        +
      </Button>
    </div>
  );
}

export default TodoInput;

