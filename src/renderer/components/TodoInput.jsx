import { useState } from 'react';
import { Input, Button, Space } from 'antd';
import { StarOutlined, StarFilled, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

function TodoInput({ onAddTodo, isImportant, onToggleImportant }) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const text = inputValue.trim();
    if (text) {
      onAddTodo(text);
      setInputValue('');
    }
  };

  return (
    <Space.Compact style={{ width: '100%' }}>
      <Button
        icon={isImportant ? <StarFilled /> : <StarOutlined />}
        type={isImportant ? 'primary' : 'default'}
        onClick={onToggleImportant}
        title={t('input.markImportant')}
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
        placeholder={t('input.placeholder')}
        maxLength={200}
      />
      <Button 
        type="primary" 
        icon={<PlusOutlined />}
        onClick={handleAdd}
      />
    </Space.Compact>
  );
}

export default TodoInput;

