import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Базовый URL бэкенда
const API_BASE_URL = 'http://localhost:4000/api';

// Async Thunk для получения задач с пагинацией и сортировкой
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async ({ page = 1, sort_field = 'createdAt', sort_dir = 'desc' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`, {
        params: { page, sort_field, sort_dir }
      });
      // Предполагаем, что API возвращает { success: true, data: { items, total, page, pageSize } }
      if (response.data.success) {
          return response.data.data;
      } else {
          return rejectWithValue(response.data.error || 'Failed to fetch tasks');
      }
    } catch (error) {
      // Обрабатываем ошибки сети или сервера
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.error || error.response.data.message || 'Server Error');
      } else {
        return rejectWithValue('Network Error');
      }
    }
  }
);

// Async Thunk для создания новой задачи
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
      // ИСПРАВЛЕНО: Бэкенд возвращает { success: true, message: '...', data: { ... } }
      // Нам нужна задача из поля data
      if (response.data.success) {
          return response.data.data; // Возвращаем созданную задачу из data
      } else {
          return rejectWithValue(response.data.error || 'Failed to create task');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.error || error.response.data.message || 'Server Error');
      } else {
        return rejectWithValue('Network Error');
      }
    }
  }
);

// Async Thunk для обновления задачи (требует токена)
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, updateData, token }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      console.log("Конфиг Axios для updateTask:", config);
      const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, updateData, config);
      
      // ИСПРАВЛЕНО: Бэкенд теперь возвращает { success: true, message: '...', updatedTask: { ... } }
      // Нам нужна задача из поля updatedTask
      if (response.data.success) {
          return response.data.updatedTask; // Возвращаем обновленную задачу из updatedTask
      } else {
          return rejectWithValue(response.data.error || 'Failed to update task');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.error || error.response.data.message || 'Server Error');
      } else {
        return rejectWithValue('Network Error or Unauthorized');
      }
    }
  }
);

// Начальное состояние слайса
const initialState = {
  items: [], // Массив задач
  total: 0, // Общее количество задач
  page: 1, // Текущая страница
  pageSize: 3, // Размер страницы
  sortField: 'createdAt', // Поле для сортировки
  sortDirection: 'desc', // Направление сортировки
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // Сообщение об ошибке
};

// Создание самого слайса
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Синхронные редьюсеры (если понадобятся)
    setSortField(state, action) {
      state.sortField = action.payload;
    },
    setSortDirection(state, action) {
      state.sortDirection = action.payload;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    resetTasks(state) {
        state.items = [];
        state.total = 0;
        state.page = 1;
        state.error = null;
        // status остается, чтобы не сбрасывать загрузку при сбросе данных
    }
    // Другие синхронные действия можно добавить здесь
  },
  extraReducers: (builder) => {
    builder
      // --- fetchTasks ---
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        // sortField и sortDirection не обновляются здесь, они управляются отдельно
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Используем rejectWithValue
      })
      // --- createTask ---
      .addCase(createTask.pending, (state) => {
        // Можно показать индикатор загрузки для создания
        // state.status = 'loading'; // Или отдельное поле для статуса создания
      })
      .addCase(createTask.fulfilled, (state, action) => {
        // Просто сбрасываем статус, чтобы показать, что операция завершена.
        // Компонент может вызвать fetchTasks после успешного создания.
        state.status = 'idle'; // Или 'succeeded' если хотим отследить
        state.error = null;
        // Опционально: добавить новую задачу в состояние, если нужно немедленное отображение
        // state.items.push(action.payload);
        // state.total += 1;
      })
      .addCase(createTask.rejected, (state, action) => {
        // state.status = 'failed';
        state.error = action.payload; // Используем rejectWithValue
      })
      // --- updateTask ---
      .addCase(updateTask.pending, (state) => {
        // state.status = 'loading';
        // Можно добавить поле loading для конкретной задачи
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        // console.log убраны для чистоты, но можно оставить для отладки
        // console.log("tasksSlice/updateTask.fulfilled: action received:", action);
        // console.log("tasksSlice/updateTask.fulfilled: action.payload:", action.payload);
        
        state.status = 'idle'; // Или 'succeeded'
        state.error = null;
        
        // ИСПРАВЛЕНО:
        // action.payload теперь это сама обновленная задача (updatedTask), как мы вернули из thunk
        const updatedTask = action.payload;
        
        // Находим и обновляем задачу в состоянии
        const index = state.items.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
          state.items[index] = updatedTask;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        // state.status = 'failed';
        state.error = action.payload; // Используем rejectWithValue
      });
  },
});

// Экспортируем действия (actions)
export const { setSortField, setSortDirection, setPage, resetTasks } = tasksSlice.actions;

// Экспортируем редьюсер по умолчанию
export default tasksSlice.reducer;

// Селекторы (selectors) - функции для получения данных из состояния
// Они делают компоненты менее зависимыми от структуры состояния
export const selectAllTasks = (state) => state.tasks.items;
export const selectTasksStatus = (state) => state.tasks.status;
export const selectTasksError = (state) => state.tasks.error;
export const selectCurrentPage = (state) => state.tasks.page;
export const selectTotalTasks = (state) => state.tasks.total;
export const selectPageSize = (state) => state.tasks.pageSize;
export const selectSortField = (state) => state.tasks.sortField;
export const selectSortDirection = (state) => state.tasks.sortDirection;