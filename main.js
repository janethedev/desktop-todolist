const { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage } = require('electron');
// Ensure Windows taskbar groups pinned and running icons together by using a stable AppUserModelID
const APP_ID = 'com.janethedev.todolist';
if (process.platform === 'win32') {
  app.setAppUserModelId(APP_ID);
}
const path = require('path');
const fs = require('fs');

// 禁用GPU硬件加速，避免GPU进程错误
app.disableHardwareAcceleration();

// 单实例锁：确保应用只能运行一个实例
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // 如果没有获取到锁，说明已有实例在运行，直接退出
  app.quit();
} else {
  // 当尝试运行第二个实例时，聚焦到已存在的窗口
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      // 如果窗口被隐藏，先显示
      if (!mainWindow.isVisible()) {
        mainWindow.show();
      }
      // 如果窗口被最小化，恢复窗口
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      // 聚焦窗口
      mainWindow.focus();
    }
  });
}

// 数据文件路径
const todosFilePath = path.join(app.getPath('userData'), 'todos.json');

let mainWindow;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 280,
    height: 380,
    minWidth: 280,
    minHeight: 300,
    frame: false,
    maximizable: false,
    icon: path.join(__dirname, 'todo_list.ico'), // 添加这一行
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    backgroundColor: '#FFFFFF',
    title: 'To-Do List',
    resizable: true
  });

  // 隐藏菜单栏
  Menu.setApplicationMenu(null);

  mainWindow.loadFile('index.html');
  
  // 点击关闭按钮时隐藏到托盘而不是退出
  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
  
  // 开发时打开开发者工具（可选）
  // mainWindow.webContents.openDevTools();
}

// 创建系统托盘图标
function createTray() {
  // 从文件加载托盘图标
  const iconPath = path.join(__dirname, 'todo_list.ico');
  const icon = nativeImage.createFromPath(iconPath);
  
  tray = new Tray(icon);
  
  // 创建托盘菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示窗口',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: '隐藏窗口',
      click: () => {
        mainWindow.hide();
      }
    },
    {
      type: 'separator'
    },
    {
      label: '退出',
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
  
  // 设置托盘图标的工具提示
  tray.setToolTip('');
  
  // 设置托盘右键菜单
  tray.setContextMenu(contextMenu);
  
  // 单击托盘图标显示/隐藏窗口
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
}

// 应用准备就绪时创建窗口和托盘
app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 所有窗口关闭时不退出应用，保持托盘图标
app.on('window-all-closed', (e) => {
  // 不退出应用，让托盘图标继续运行
  e.preventDefault();
});

// IPC处理：加载待办事项
ipcMain.handle('load-todos', async () => {
  try {
    if (fs.existsSync(todosFilePath)) {
      const data = fs.readFileSync(todosFilePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading todos:', error);
    return [];
  }
});

// IPC处理：保存待办事项
ipcMain.handle('save-todos', (event, todos) => {
  try {
    fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving todos:', error);
  }
});

// IPC处理：关闭窗口
ipcMain.on('close-window', () => {
  mainWindow?.close();
});

// IPC处理：切换窗口置顶
ipcMain.handle('toggle-always-on-top', (event, flag) => {
  mainWindow?.setAlwaysOnTop(flag);
});

