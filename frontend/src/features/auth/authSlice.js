import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const initialState = {
  token: localStorage.getItem('token'), // Загружаем токен из localStorage при инициализации
  isAdmin: !!localStorage.getItem('token'), // Если токен есть, считаем админом (проверка на бэке при запросах)
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.status = 'succeeded';
      state.token = action.payload.token;
      state.isAdmin = true;
      state.error = null;
      // Сохраняем токен в localStorage
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.status = 'failed';
      state.token = null;
      state.isAdmin = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.isAdmin = false;
      state.status = 'idle';
      state.error = null;
      // Удаляем токен из localStorage
      localStorage.removeItem('token');
    },
    // --- Добавлено: Редьюсер для внешнего сброса (logout в другой вкладке) ---
    storageLogout: (state) => {
       state.token = null;
       state.isAdmin = false;
       state.status = 'idle';
       state.error = null;
       // Не нужно удалять из localStorage здесь, так как событие storage
       // означает, что localStorage уже был изменен в другой вкладке.
    }
    // --- Конец добавления ---
  },
});

// --- Добавлено: Экспорт нового действия ---
export const { loginStart, loginSuccess, loginFailure, logout, storageLogout } = authSlice.actions;
// --- Конец добавления ---

// Асинхронный thunk для логина
export const login = (credentials) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    if (response.data.success) {
      dispatch(loginSuccess({ token: response.data.token }));
      return { success: true };
    } else {
      dispatch(loginFailure(response.data.error || 'Login failed'));
      return { success: false, error: response.data.error };
    }
  } catch (error) {
    let errorMessage = 'Network Error';
    if (error.response && error.response.data) {
      errorMessage = error.response.data.error || error.response.data.message || 'Server Error';
    }
    dispatch(loginFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

// Селекторы
export const selectAuthToken = (state) => state.auth.token;
export const selectIsAdmin = (state) => state.auth.isAdmin;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;