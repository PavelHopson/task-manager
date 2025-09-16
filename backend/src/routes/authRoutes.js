import express from 'express';
const router = express.Router();
import { login } from '../controllers/authController.js';

// POST /api/auth/login - Вход администратора
router.post('/login', login);

export default router;