const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  loadTodos: () => ipcRenderer.invoke('load-todos'),
  saveTodos: (todos) => ipcRenderer.invoke('save-todos', todos),
  closeWindow: () => ipcRenderer.send('close-window'),
  toggleAlwaysOnTop: (flag) => ipcRenderer.invoke('toggle-always-on-top', flag)
});

