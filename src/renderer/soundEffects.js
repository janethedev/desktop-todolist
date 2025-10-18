// 播放任务完成音效 - 清脆的"叮咚"双音
export const playCheckSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // 第一个音符（高音"叮"）
      const oscillator1 = audioContext.createOscillator();
      const gainNode1 = audioContext.createGain();
      oscillator1.connect(gainNode1);
      gainNode1.connect(audioContext.destination);
      
      oscillator1.type = 'sine';
      oscillator1.frequency.setValueAtTime(1046.5, audioContext.currentTime); // C6
      gainNode1.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator1.start(audioContext.currentTime);
      oscillator1.stop(audioContext.currentTime + 0.1);
      
      // 第二个音符（中音"咚"）
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();
      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);
      
      oscillator2.type = 'sine';
      oscillator2.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.08); // G5
      gainNode2.gain.setValueAtTime(0.25, audioContext.currentTime + 0.08);
      gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
      
      oscillator2.start(audioContext.currentTime + 0.08);
      oscillator2.stop(audioContext.currentTime + 0.25);
    } catch (error) {
      console.error('播放音效失败:', error);
    }
  };
  
  // 播放取消完成音效
  export const playUncheckSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.exponentialRampToValueAtTime(349.23, audioContext.currentTime + 0.1); // F4
      
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.12);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.12);
    } catch (error) {
      console.error('播放音效失败:', error);
    }
  };