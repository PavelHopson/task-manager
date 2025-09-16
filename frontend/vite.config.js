// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: { ... }, // Настройки для `vite dev` (локальная разработка)
  // build: { ... },  // Настройки сборки
  // --- КРИТИЧЕСКИ ВАЖНАЯ ЧАСТЬ ДЛЯ `vite preview` ---
  preview: {
    host: true, // Слушаем на 0.0.0.0 и ОТКЛЮЧАЕМ базовую проверку Host-заголовка
    port: 4173, // Порт по умолчанию для preview, Railway переопределит $PORT
    strictPort: false,
    // --- ЯВНО разрешаем хост Railway ---
    // ЭТО РЕШАЕТ ПРОБЛЕМУ 403 Forbidden
    allowedHosts: [
      'task-manager-copy-production.up.railway.app'
      // Если вы хотите быть менее специфичным (на случай изменения имени сервиса):
      // '.railway.app' // Разрешает все поддомены .railway.app
    ]
    // --- КОНЕЦ ЯВНОГО РАЗРЕШЕНИЯ ---
  }
  // --- КОНЕЦ КРИТИЧЕСКОЙ ЧАСТИ ---
});
