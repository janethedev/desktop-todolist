import { useState } from 'react';
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
      <div className="titlebar-actions">
        <button
          className={`pin-btn ${isPinned ? 'pinned' : ''}`}
          onClick={handlePin}
          title="置顶"
        >
          {isPinned ? <PushpinFilled /> : <PushpinOutlined />}
        </button>
        <button className="minimize-btn" onClick={handleMinimize} title="最小化">
          <MinusOutlined />
        </button>
        <button className="close-btn" onClick={handleClose} title="关闭">
          <CloseOutlined />
        </button>
      </div>
    </div>
  );
}

export default TitleBar;

