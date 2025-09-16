// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: { ... }, // Настройки для `vite dev` (локальная разработка)
  // build: { ... },  // Настройки сборки
  // --- Добавляем или изменяем секцию `preview` ---
  preview: {
    host: true, // Слушаем на 0.0.0.0 и ОТКЛЮЧАЕМ проверку Host-заголовка по умолчанию
    port: 4173,  // Порт по умолчанию для preview, Railway переопределит $PORT
    strictPort: false,
    // --- ЯВНО разрешаем хост Railway ---
    // ЭТО РЕШАЕТ ПРОБЛЕМУ 403
    allowedHosts: [
      'task-manager-copy-production.up.railway.app'
    ]
    // --- КОНЕЦ ЯВНОГО РАЗРЕШЕНИЯ ---
  }
  // --- КОНЕЦ ИЗМЕНЕНИЙ ---
})
