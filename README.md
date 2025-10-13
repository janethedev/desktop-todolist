# To-Do List 桌面应用

一个简洁、现代的待办事项桌面应用，使用 Electron 构建，支持 Windows、Mac 和 Linux。

## ✨ 功能特性

- ✅ 添加待办事项
- ✅ 标记完成/未完成
- ✅ 删除待办事项
- ✅ 窗口置顶功能
- ✅ 本地数据持久化（自动保存到本地JSON文件）
- ✅ 实时统计（总计和已完成数量）
- ✅ 现代化UI设计，基于Figma设计规范
- ✅ 无边框窗口，简洁界面
- ✅ 跨平台支持

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 运行应用

```bash
npm start
```

## 📁 项目结构

```
to-do-list/
├── main.js              # Electron主进程
├── preload.js           # 预加载脚本（安全通信桥梁）
├── index.html           # 主界面
├── styles.css           # 样式表
├── renderer.js          # 渲染进程业务逻辑
├── package.json         # 项目配置
└── README.md           # 说明文档
```

## 💾 数据存储

待办事项数据自动保存在：
- **Windows**: `%APPDATA%/todo-list-app/todos.json`
- **Mac**: `~/Library/Application Support/todo-list-app/todos.json`
- **Linux**: `~/.config/todo-list-app/todos.json`

## 🎨 UI设计

- 渐变紫色背景
- 圆角卡片设计
- 流畅的动画效果
- 响应式布局
- 自定义滚动条

## 🔧 技术栈

- **Electron**: 跨平台桌面应用框架
- **Node.js**: 文件系统操作
- **HTML/CSS/JavaScript**: 前端界面
- **IPC通信**: 主进程与渲染进程安全通信
- **事件委托**: 优化性能的事件处理机制

## 📝 使用说明

1. 在输入框中输入待办事项内容
2. 点击"添加"按钮或按回车键添加
3. 点击复选框标记任务完成/未完成
4. 点击"删除"按钮移除任务
5. 点击📌图标置顶窗口（始终显示在最前面）
6. 点击✕图标关闭应用
7. 所有操作自动保存，下次打开应用时数据仍在

## ⚡ 性能优化

- 使用事件委托减少内存占用
- 移除未使用的代码和依赖
- 优化CSS，减少重复样式
- 禁用GPU硬件加速，避免兼容性问题

## 🛡️ 安全性

- 启用 `contextIsolation` 隔离上下文
- 使用 `preload.js` 安全暴露API
- 禁用 `nodeIntegration` 防止安全风险
- HTML内容转义防止XSS攻击

## 📦 打包发布

如需打包成可执行文件，可以使用 electron-builder：

```bash
npm install --save-dev electron-builder
```

在 package.json 中添加打包脚本和配置，然后运行：

```bash
npm run build
```

## 📄 许可证

MIT License

