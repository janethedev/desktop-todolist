import { invoke } from '@tauri-apps/api/core';

// Tauri API 适配层 - 替换 Electron API
export const tauriAPI = {
  loadTodos: async () => {
    const todosString = await invoke('load_todos');
    return JSON.parse(todosString);
  },
  
  saveTodos: async (todos) => {
    const todosString = JSON.stringify(todos);
    await invoke('save_todos', { todos: todosString });
  },
  
  closeWindow: async () => {
    await invoke('close_window');
  },
  
  minimizeWindow: async () => {
    await invoke('minimize_window');
  },
  
  toggleAlwaysOnTop: async (flag) => {
    await invoke('toggle_always_on_top', { flag });
  },
  
  loadLanguage: async () => {
    return await invoke('load_language');
  }
};

// 挂载到 window 对象，保持与 Electron 版本的兼容性
if (typeof window !== 'undefined') {
  window.electronAPI = tauriAPI;
}

