import { useState } from 'react';

function TitleBar() {
  const [isPinned, setIsPinned] = useState(false);

  const handleClose = () => {
    window.electronAPI.closeWindow();
  };

  const handlePin = async () => {
    const newPinnedState = !isPinned;
    setIsPinned(newPinnedState);
    await window.electronAPI.toggleAlwaysOnTop(newPinnedState);
  };

  return (
    <div className="titlebar">
      <button
        className={`pin-btn ${isPinned ? 'pinned' : ''}`}
        onClick={handlePin}
        title="置顶"
      >
        📌
      </button>
      <span className="titlebar-text"></span>
      <button className="close-btn" onClick={handleClose}>
        ✕
      </button>
    </div>
  );
}

export default TitleBar;

