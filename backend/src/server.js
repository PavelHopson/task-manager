import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Импортируем маршруты (пока пустые, создадим их позже)
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Импортируем централизованный обработчик ошибок (создадим позже)
import errorHandler from './middleware/errorHandler.js';

// Загружаем переменные окружения из .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// --- Middleware ---
// Логирование запросов (опционально, но полезно для разработки)
// Можно использовать morgan, но для начала просто console.log в middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Разрешаем CORS (для взаимодействия с фронтендом)
// Позже можно будет указать конкретный origin (например, вашего фронтенда на Vercel)
app.use(cors({
  origin: '*', // Для разработки. В production лучше указать конкретный origin.
  credentials: true // Если используете куки для аутентификации
}));

// Парсинг JSON в теле запроса
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Для данных формы


// --- Маршруты ---
// Базовый маршрут для проверки
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running!' });
});

// Подключаем маршруты задач
app.use('/api/tasks', taskRoutes);
// Подключаем маршруты аутентификации
app.use('/api/auth', authRoutes);


// --- Обработка ошибок ---
// Должен быть ПОСЛЕДНИМ middleware
app.use(errorHandler);

export default app;