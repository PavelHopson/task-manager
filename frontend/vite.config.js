// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Это ключевая настройка! Слушает на 0.0.0.0 и отключает проверку хоста
    port: 4173, // Порт по умолчанию, Railway переопределит через $PORT
    strictPort: false,
  },
  preview: { // Явно настраиваем команду `vite preview`
    host: true, // И для preview тоже
    port: 4173,
    strictPort: false,
  }
})
