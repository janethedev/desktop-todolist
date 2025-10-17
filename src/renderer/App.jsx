import { useState, useEffect } from 'react';
import { Layout, Flex } from 'antd';
import { getCurrentWindow } from '@tauri-apps/api/window';
import TitleBar from './components/TitleBar';
import TodoInput from './components/TodoInput';
import TodoStats from './components/TodoStats';
import TodoList from './components/TodoList';

const { Content } = Layout;

function App() {
  const [todos, setTodos] = useState([]);
  const [isImportant, setIsImportant] = useState(false);

  // 排序待办事项：已完成的总是在未完成的后面，同状态内按 order 排序
  const sortTodos = (todosToSort) => {
    return [...todosToSort].sort((a, b) => {
      // 已完成的总是在未完成的后面
      if (a.completed !== b.completed) {
        return a.completed - b.completed;
      }
      // 同状态内按 order 排序
      return (a.order || 0) - (b.order || 0);
    });
  };

  // 初始化：加载已保存的待办事项
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await window.electronAPI.loadTodos();
        
        // 向后兼容：为旧数据添加 important 和 order 字段
        const todosWithFields = loadedTodos.map((todo, index) => ({
          ...todo,
          important: todo.important || false,
          order: todo.order !== undefined ? todo.order : index
        }));
        
        setTodos(sortTodos(todosWithFields));
      } catch (error) {
        console.error('加载待办事项失败:', error);
        // 即使加载失败，也继续使用空数组
      } finally {
        // 无论成功还是失败，都显示窗口
        try {
          const appWindow = getCurrentWindow();
          await appWindow.show();
        } catch (err) {
          console.error('显示窗口失败:', err);
        }
      }
    };

    loadTodos();
  }, []);

  // 保存待办事项到文件
  const saveTodos = async (newTodos) => {
    await window.electronAPI.saveTodos(newTodos);
  };

  // 添加待办事项
  const handleAddTodo = (text) => {
    const uncompletedTodos = todos.filter(todo => !todo.completed);
    
    let newOrder;
    if (isImportant) {
      // 新增重要任务：排在所有未完成重要任务的最前面
      const uncompletedImportantTodos = uncompletedTodos.filter(todo => todo.important);
      if (uncompletedImportantTodos.length > 0) {
        newOrder = Math.min(...uncompletedImportantTodos.map(todo => todo.order || 0)) - 1;
      } else {
        // 没有重要任务，排在所有未完成任务的最前面
        newOrder = uncompletedTodos.length > 0 
          ? Math.min(...uncompletedTodos.map(todo => todo.order || 0)) - 1 
          : 0;
      }
    } else {
      // 新增普通任务：排在所有未完成普通任务的最前面
      const uncompletedNormalTodos = uncompletedTodos.filter(todo => !todo.important);
      if (uncompletedNormalTodos.length > 0) {
        newOrder = Math.min(...uncompletedNormalTodos.map(todo => todo.order || 0)) - 1;
      } else {
        // 没有普通任务，排在所有未完成任务的最后面
        newOrder = uncompletedTodos.length > 0 
          ? Math.max(...uncompletedTodos.map(todo => todo.order || 0)) + 1 
          : 0;
      }
    }
    
    const newTodo = {
      id: Date.now(),
      text: text,
      completed: false,
      important: isImportant,
      order: newOrder
    };

    const newTodos = [...todos, newTodo];
    const sortedTodos = sortTodos(newTodos);
    
    setTodos(sortedTodos);
    saveTodos(sortedTodos);
    
    // 重置重要性标记
    setIsImportant(false);
  };

  // 切换完成状态
  const handleToggleComplete = (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    const newCompleted = !todo.completed;
    
    // 如果从未完成变为已完成，移到已完成列表的末尾
    // 如果从已完成变为未完成，移到未完成列表的末尾
    let newOrder = todo.order;
    if (newCompleted) {
      // 变为已完成：order 设置为已完成项目中最大的 order + 1
      const completedTodos = todos.filter(t => t.completed);
      newOrder = completedTodos.length > 0 
        ? Math.max(...completedTodos.map(t => t.order || 0)) + 1
        : (todos.length > 0 ? Math.max(...todos.map(t => t.order || 0)) + 1 : 0);
    } else {
      // 变为未完成：order 设置为未完成项目中最大的 order + 1
      const uncompletedTodos = todos.filter(t => !t.completed);
      newOrder = uncompletedTodos.length > 0 
        ? Math.max(...uncompletedTodos.map(t => t.order || 0)) + 1
        : 0;
    }
    
    const newTodos = todos.map(t =>
      t.id === id ? { ...t, completed: newCompleted, order: newOrder } : t
    );
    const sortedTodos = sortTodos(newTodos);
    
    setTodos(sortedTodos);
    saveTodos(sortedTodos);
  };

  // 删除待办事项
  const handleDelete = (id) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  // 编辑待办事项
  const handleEdit = (id, newText) => {
    const newTodos = todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    );
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  // 清空已完成的待办事项
  const handleClearCompleted = () => {
    const newTodos = todos.filter(todo => !todo.completed);
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  // 处理拖拽排序
  const handleReorder = (reorderedTodos) => {
    // 更新 order 字段
    const todosWithNewOrder = reorderedTodos.map((todo, index) => ({
      ...todo,
      order: index
    }));
    
    setTodos(todosWithNewOrder);
    saveTodos(todosWithNewOrder);
  };

  // 统计信息
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  return (
    <Layout className="app" style={{ height: '100vh' }}>
      <TitleBar />
      <Content className="container" style={{ padding: '10px 20px' }}>
        <Flex vertical gap={10} style={{ height: '100%' }}>
          <TodoInput
            onAddTodo={handleAddTodo}
            isImportant={isImportant}
            onToggleImportant={() => setIsImportant(!isImportant)}
          />
          <TodoStats 
            total={totalTodos} 
            completed={completedTodos} 
            onClearCompleted={handleClearCompleted}
          />
          <div style={{ 
            flex: 1, 
            overflow: 'auto',
            marginLeft: '-14px',
            marginRight: '-4px'
             }}>
            <TodoList
              todos={todos}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onReorder={handleReorder}
            />
          </div>
        </Flex>
      </Content>
    </Layout>
  );
}

export default App;

