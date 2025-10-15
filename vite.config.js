import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  
  // Vite 开发服务器配置（Tauri 需要）
  server: {
    port: 5173,
    strictPort: true,
  },
  
  // 构建配置
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/renderer')
    }
  },
  
  // 环境变量配置
  define: {
    'process.env': {}
  }
});

