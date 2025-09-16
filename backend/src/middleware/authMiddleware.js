import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const authMiddleware = (req, res, next) => {
  // Получаем токен из заголовка Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Извлекаем токен

  try {
    // Проверяем токен
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Добавляем информацию о пользователе в объект запроса
    next(); // Передаем управление следующему middleware или контроллеру
  } catch (error) {
    console.error('JWT Verification Error:', error.message); // Логируем ошибку верификации
    return res.status(401).json({ success: false, error: 'Invalid token.' });
  }
};

export default authMiddleware;