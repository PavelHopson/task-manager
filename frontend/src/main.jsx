import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // Импортируем Provider из react-redux
import { store } from './app/store'; // Импортируем наш store
import App from './App.jsx'; // Импортируем основной компонент App
// import './index.css'; // Импортируем глобальные стили (если есть)

// Создаем корневой элемент для рендеринга
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Оборачиваем App в Provider и передаем ему store */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);