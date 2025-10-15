function TodoStats({ total, completed }) {
  return (
    <div className="stats">
      <span>总计: {total}</span>
      <span>已完成: {completed}</span>
    </div>
  );
}

export default TodoStats;

