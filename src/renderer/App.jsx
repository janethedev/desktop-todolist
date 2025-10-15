import { useState, useEffect } from 'react';
import TitleBar from './components/TitleBar';
import TodoInput from './components/TodoInput';
import TodoStats from './components/TodoStats';
import TodoList from './components/TodoList';

function App() {
  const [todos, setTodos] = useState([]);
  const [isImportant, setIsImportant] = useState(false);

  // 排序待办事项：未完成的在前，已完成的在后，重要的在最前面
  const sortTodos = (todosToSort) => {
    return [...todosToSort].sort((a, b) => {
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
  };

  // 初始化：加载已保存的待办事项
  useEffect(() => {
    const loadTodos = async () => {
      const loadedTodos = await window.electronAPI.loadTodos();
      
      // 向后兼容：为旧数据添加 important 字段
      const todosWithImportant = loadedTodos.map(todo => ({
        ...todo,
        important: todo.important || false
      }));
      
      setTodos(sortTodos(todosWithImportant));
    };

    loadTodos();
  }, []);

  // 保存待办事项到文件
  const saveTodos = async (newTodos) => {
    await window.electronAPI.saveTodos(newTodos);
  };

  // 添加待办事项
  const handleAddTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text: text,
      completed: false,
      important: isImportant
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
    const newTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
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

  // 统计信息
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  return (
    <div className="app">
      <TitleBar />
      <div className="container">
        <TodoInput
          onAddTodo={handleAddTodo}
          isImportant={isImportant}
          onToggleImportant={() => setIsImportant(!isImportant)}
        />
        <TodoStats total={totalTodos} completed={completedTodos} />
        <TodoList
          todos={todos}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}

export default App;

