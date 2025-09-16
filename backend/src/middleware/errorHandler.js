// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Логируем ошибку на сервере
  console.error(err.stack);

  // Определяем статус и сообщение
  const statusCode = res.statusCode ? res.statusCode : 500; // Если статус не установлен, 500
  const message = err.message || 'Internal Server Error';

  // Отправляем JSON-ответ с ошибкой
  res.status(statusCode).json({
    success: false,
    error: message,
    // В production НЕ стоит отправлять stack trace клиенту
    // stack: process.env.NODE_ENV === 'production' ? null : err.stack
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined // Показываем stack только в dev
  });
};

export default errorHandler;