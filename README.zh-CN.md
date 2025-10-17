<h1 align="center">
  <img src="./src-tauri/icons/icon.ico" alt="QuickTask" width="128" />
  <br>
  QuickTask
  <br>
</h1>

<h3 align="center">
  轻量、快速、优雅的桌面待办事项应用
</h3>

<p align="center">
  基于 Tauri 2 构建 - 体积小巧，性能卓越
</p>

<p align="center">
  简体中文 | <a href="./README.md">English</a>
</p>

---

## 📸 预览

|                                               |                                                |                                                |
| --------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| <img src="./docs/preview_1.png" alt="预览" /> | <img src="./docs/preview_2.png" alt="预览"  /> | <img src="./docs/preview_3.png" alt="预览"  /> |

## 📥 下载安装

前往 [Release 页面](https://github.com/janethedev/desktop-todolist/releases) 下载最新版本

## ✨ 核心功能

- **快速添加** - 输入框即时添加任务
- **内联编辑** - 双击任务文本即可编辑
- **优先级标记** - 星标标注重要任务
- **智能排序** - 重要任务自动置顶
- **拖拽排序** - 拖动调整任务顺序
- **系统托盘** - 最小化到托盘，随时可用
- **窗口置顶** - 一键置顶，便于查看
- **单实例运行** - 防止重复启动
- **多语言支持** - 通过托盘菜单切换中英文
- **自动保存** - 数据实时持久化

## 🌍 语言支持

- **默认语言**：英文
- **切换方式**：右键托盘图标 → 语言 → 选择语言
- **支持语言**：English、简体中文
- **持久化**：语言选择在重启后保持

## 🛠️ 技术栈

**前端**
- React 19 + Ant Design 5
- Vite 7
- i18next（国际化）

**后端**
- Tauri 2.8 + Rust
- 系统托盘子菜单
- 单实例插件

## 🚀 为什么选择 Tauri？

| 特性 | QuickTask (Tauri) | Electron |
|------|-------------------|----------|
| 📦 安装包体积 | ~3-5 MB | ~50-150 MB |
| 💾 内存占用 | ~30-50 MB | ~100-200 MB |
| ⚡ 启动速度 | < 1 秒 | 2-5 秒 |
| 🔒 安全性 | Rust 内存安全 | JavaScript 运行时 |

## 💻 本地开发

### 环境要求
- Node.js 16+
- Rust 1.77.2+
- Windows: Visual Studio C++ Build Tools

### 快速开始

```bash
# 克隆项目
git clone https://github.com/janethedev/desktop-todolist.git
cd desktop-todolist

# 安装依赖
npm install

# 启动开发环境
npm run dev
```

### 打包发布

```bash
npm run build
```

安装包位置：
- NSIS：`src-tauri/target/release/bundle/nsis/`
- MSI：`src-tauri/target/release/bundle/msi/`

## ⌨️ 快捷操作

- `Enter` - 添加任务 / 保存编辑
- `Esc` - 取消编辑
- 双击任务 - 进入编辑模式
- 左键托盘 - 显示/隐藏窗口
- 右键托盘 - 显示菜单

## 📂 项目结构

```
QuickTask/
├── src/renderer/
│   ├── App.jsx              # 主应用组件
│   ├── i18n.js              # 国际化配置
│   ├── locales/             # 语言文件
│   │   ├── en-US.json
│   │   └── zh-CN.json
│   └── components/
│       ├── TitleBar.jsx
│       ├── TodoInput.jsx
│       ├── TodoList.jsx
│       └── TodoStats.jsx
│
└── src-tauri/
    ├── src/lib.rs           # 核心逻辑（托盘、国际化）
    └── tauri.conf.json      # Tauri 配置
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT License](LICENSE)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/janethedev">Jane The Dev</a>
</p>

