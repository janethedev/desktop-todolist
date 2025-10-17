import { Space, Typography } from 'antd';

const { Text } = Typography;

function TodoStats({ total, completed }) {
  return (
    <Space className="stats" style={{ width: '100%', justifyContent: 'space-between', padding: '8px 12px', background: '#fafafa', borderRadius: '4px' }}>
      <Text type="secondary" style={{ fontSize: 13 }}>总计: {total}</Text>
      <Text type="secondary" style={{ fontSize: 13 }}>已完成: {completed}</Text>
    </Space>
  );
}

export default TodoStats;

