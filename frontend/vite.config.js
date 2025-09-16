// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Для dev сервера, но не помешает
    port: 5173,
  },
  // --- КРИТИЧЕСКИ ВАЖНАЯ ЧАСТЬ ДЛЯ PREVIEW ---
  preview: {
    host: true, // Слушать 0.0.0.0
    port: 4173,  // Стандартный порт preview, Railway переопределит $PORT
    strictPort: false,
    // Явно разрешаем хост Railway
    allowedHosts: [
      'task-manager-copy-production.up.railway.app'
      // Альтернатива (если имена могут меняться): '.railway.app'
    ]
  }
  // --- КОНЕЦ КРИТИЧЕСКОЙ ЧАСТИ ---
})
