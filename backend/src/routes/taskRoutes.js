import express from 'express';
const router = express.Router();
import { getTasks, createTask, updateTask } from '../controllers/taskController.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Импортируем middleware

// GET /api/tasks - Получить список задач (публичный)
router.get('/', getTasks);

// POST /api/tasks - Создать новую задачу (публичный)
router.post('/', createTask);

// PUT /api/tasks/:id - Обновить задачу (только для админа)
// Применяем authMiddleware ко всем PUT запросам на этот маршрут
router.put('/:id', authMiddleware, updateTask);

export default router;