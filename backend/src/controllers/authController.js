import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

if (!JWT_SECRET || !ADMIN_USER || !ADMIN_PASS) {
    throw new Error('Missing required environment variables: JWT_SECRET, ADMIN_USER, ADMIN_PASS');
}

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { username, password } = req.body;

    // Базовая валидация входных данных
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            error: 'Username and password are required.'
        });
    }

    // Проверка учетных данных администратора
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        // Создаем JWT токен
        const token = jwt.sign(
            { id: 'admin', username: ADMIN_USER }, // Payload
            JWT_SECRET, // Secret
            { expiresIn: '1h' } // Время жизни токена
        );

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token
        });
    } else {
        return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
        });
    }
};

export { login };