import { Space, Typography, Progress, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';

const { Text, Link } = Typography;

function TodoStats({ total, completed, onClearCompleted }) {
  const { t } = useTranslation();
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <Space direction="vertical" style={{ width: '100%', padding: '8px 12px', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderRadius: '4px' }} size={2}>
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Text type="secondary" style={{ fontSize: 13 }}>
          {t('stats.completed')} {completed} / {total}
        </Text>
        {completed > 0 && (
          <Popconfirm
            title={t('stats.clearConfirmTitle')}
            description={t('stats.clearConfirmDescription')}
            onConfirm={onClearCompleted}
            okText={t('stats.confirmOk')}
            cancelText={t('stats.confirmCancel')}
          >
            <Link type="secondary" style={{ fontSize: 13 }}>{t('stats.clearCompleted')}</Link>
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

