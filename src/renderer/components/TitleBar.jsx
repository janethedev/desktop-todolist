import { useState } from 'react';
import { Button, Space } from 'antd';
import { PushpinOutlined, PushpinFilled, MinusOutlined, CloseOutlined } from '@ant-design/icons';

function TitleBar() {
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
          title="置顶"
          className={isPinned ? 'titlebar-btn-pinned' : ''}
        />
        <Button
          type="text"
          size="small"
          icon={<MinusOutlined />}
          onClick={handleMinimize}
          title="最小化"
        />
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          onClick={handleClose}
          title="关闭"
          danger
          className="titlebar-btn-close"
        />
      </Space>
    </div>
  );
}

export default TitleBar;

