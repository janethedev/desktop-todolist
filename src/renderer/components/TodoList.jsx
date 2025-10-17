import { useState } from 'react';
import { List, Checkbox, Input, Button, Space, Flex, Typography, Empty, Dropdown } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, StarFilled, HolderOutlined, MoreOutlined } from '@ant-design/icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const { Text } = Typography;

// 可拖拽的待办事项组件
function SortableTodoItem({ todo, editingId, editValue, setEditValue, handleStartEdit, handleSaveEdit, handleCancelEdit, onToggleComplete, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    // 只保留垂直方向的移动，忽略水平方向
    transform: transform ? `translate3d(0, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <List.Item
      ref={setNodeRef}
      style={style}
      className={`todo-list-item ${todo.important ? 'todo-item-important' : ''}`}
    >
      {/* 拖拽手柄 - Notion 风格，浮在容器外面 */}
      <div 
        className="drag-handle"
        {...attributes} 
        {...listeners} 
        title="拖动排序"
      >
        <HolderOutlined />
      </div>
      
      <Flex justify="space-between" align="center" style={{ width: '100%' }}>
        <Flex flex={1} align="center" gap={8} style={{ minWidth: 0 }}>
          <Checkbox
            checked={todo.completed}
            onChange={() => onToggleComplete(todo.id)}
          />
          {/* {todo.important && (
            <StarFilled style={{ color: '#faad14', fontSize: 14, marginRight: -4 }} />
          )} */}
          {editingId === todo.id ? (
            <Space.Compact style={{ flex: 1, minWidth: 0 }}>
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
            </Space.Compact>
          ) : (
            <Text
              className="todo-text"
              delete={todo.completed}
              type={todo.completed ? 'secondary' : undefined}
              onDoubleClick={() => handleStartEdit(todo)}
              style={{ flex: 1, cursor: 'pointer', userSelect: 'none' }}
            >
              {todo.text}
            </Text>
          )}
        </Flex>
        {editingId !== todo.id && (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'edit',
                  label: '编辑',
                  icon: <EditOutlined />,
                  onClick: () => handleStartEdit(todo)
                },
                {
                  key: 'delete',
                  label: '删除',
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () => onDelete(todo.id)
                }
              ]
            }}
            trigger={['click']}
            align={{
              offset: [16, 4],  // [水平偏移, 垂直偏移]
            }}
          >
            <Button
              type="text"
              size="small"
              icon={<MoreOutlined />}
              title="更多操作"
            />
          </Dropdown>
        )}
      </Flex>
    </List.Item>
  );
}

function TodoList({ todos, onToggleComplete, onDelete, onEdit, onReorder }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over.id);
      
      const newTodos = arrayMove(todos, oldIndex, newIndex);
      onReorder(newTodos);
    }
  };

  if (todos.length === 0) {
    return (
      <Flex className="todo-list" justify="center" align="center">
        <Empty
          description={
            <Space direction="vertical" size={0}>
              <Text>暂无待办事项</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>添加你的第一个任务</Text>
            </Space>
          }
        />
      </Flex>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={todos.map(todo => todo.id)}
        strategy={verticalListSortingStrategy}
      >
        <List
          className="todo-list"
          dataSource={todos}
          renderItem={(todo) => (
            <SortableTodoItem
              key={todo.id}
              todo={todo}
              editingId={editingId}
              editValue={editValue}
              setEditValue={setEditValue}
              handleStartEdit={handleStartEdit}
              handleSaveEdit={handleSaveEdit}
              handleCancelEdit={handleCancelEdit}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
            />
          )}
        />
      </SortableContext>
    </DndContext>
  );
}

export default TodoList;

