import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import './tauri-api';  // 导入 Tauri API 适配层
import './i18n';  // 导入 i18n 配置
import App from './App';
import './App.css';

// Ant Design 主题配置
const theme = {
  token: {
    colorPrimary: '#1F49AD',
    borderRadius: 4,
    fontSize: 13,
    fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={theme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);

