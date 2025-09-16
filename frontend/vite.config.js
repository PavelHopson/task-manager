// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Эти настройки для `vite dev` (локальная разработка)
    host: true, // Слушаем на 0.0.0.0
    port: 5173, // Стандартный порт для `vite dev`
  },
  preview: {
    // Эти настройки специфичны для `vite preview` (используется Railway)
    host: true, // Слушаем на 0.0.0.0
    port: 4173, // Стандартный порт для `vite preview`, Railway переопределит $PORT
    strictPort: false,
    // --- Добавлено для решения проблемы 403 ---
    allowedHosts: [
      'task-manager-copy-production.up.railway.app',
      // Если у вас несколько подобных сервисов или динамические имена, можно добавить:
      // '.railway.app' // Разрешает все поддомены .railway.app (менее строго)
    ]
    // --- Конец добавления ---
  }
})
