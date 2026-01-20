import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // === setting up proxy) ===
  server: {
    proxy: {
      // 當前端向 '/api' 發送請求時
      '/api': {
        // 將請求轉發到 Django 後端
        target: 'http://127.0.0.1:8000', 
        // 重寫路徑：將 /api/products 變成 /api/products/
        changeOrigin: true,
        // (可選) 路徑重寫，如果需要移除 /api 前綴
        // rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },


})
