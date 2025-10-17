import { Space, Typography, Progress, Popconfirm } from 'antd';

const { Text, Link } = Typography;

function TodoStats({ total, completed, onClearCompleted }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <Space direction="vertical" style={{ width: '100%', padding: '8px 12px', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderRadius: '4px' }} size={4}>
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Text type="secondary" style={{ fontSize: 13 }}>
          已完成 {completed} / {total}
        </Text>
        {completed > 0 && (
          <Popconfirm
            title="清空已完成"
            description="确定要删除所有已完成的事项吗？"
            onConfirm={onClearCompleted}
            okText="确定"
            cancelText="取消"
          >
            <Link type="secondary" style={{ fontSize: 13 }}>清空已完成</Link>
          </Popconfirm>
        )}
      </Space>
      <Progress 
        percent={percentage} 
        size="small" 
        strokeColor={{ from: '#87d068', to: '#52c41a' }}
        showInfo={false}
      />
    </Space>
  );
}

export default TodoStats;

