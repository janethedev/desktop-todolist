import { useState } from 'react';
import { Button, Space } from 'antd';
import { PushpinOutlined, PushpinFilled, MinusOutlined, CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

function TitleBar() {
  const { t } = useTranslation();
  const [isPinned, setIsPinned] = useState(false);

  const handleClose = () => {
    window.electronAPI.closeWindow();
  };

  const handleMinimize = () => {
    window.electronAPI.minimizeWindow();
  };

  const handlePin = async () => {
    const newPinnedState = !isPinned;
    setIsPinned(newPinnedState);
    await window.electronAPI.toggleAlwaysOnTop(newPinnedState);
  };

  return (
    <div className="titlebar">
      <div style={{ flex: 1 }}></div>
      <Space size={2} className="titlebar-actions">
        <Button
          type="text"
          size="small"
          icon={isPinned ? <PushpinFilled /> : <PushpinOutlined />}
          onClick={handlePin}
          title={t('titlebar.pin')}
          className={isPinned ? 'titlebar-btn-pinned' : ''}
        />
        <Button
          type="text"
          size="small"
          icon={<MinusOutlined />}
          onClick={handleMinimize}
          title={t('titlebar.minimize')}
        />
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          onClick={handleClose}
          title={t('titlebar.close')}
          danger
          className="titlebar-btn-close"
        />
      </Space>
    </div>
  );
}

export default TitleBar;

