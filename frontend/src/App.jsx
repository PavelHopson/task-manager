import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// --- Добавлен импорт действия для синхронизации logout ---
import { storageLogout } from './features/auth/authSlice';
// ---
import {
  fetchTasks,
  selectAllTasks,
  selectTasksStatus,
  selectTasksError,
  selectCurrentPage,
  selectSortField,
  selectSortDirection
} from './features/tasks/tasksSlice';
import { selectIsAdmin } from './features/auth/authSlice';
import CreateTaskForm from './components/CreateTaskForm';
import Pagination from './components/Pagination';
import SortControls from './components/SortControls';
import LoginForm from './components/LoginForm';
import EditTaskModal from './components/EditTaskModal';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);
  const status = useSelector(selectTasksStatus);
  const error = useSelector(selectTasksError);
  const currentPage = useSelector(selectCurrentPage);
  const sortField = useSelector(selectSortField);
  const sortDirection = useSelector(selectSortDirection);
  const isAdmin = useSelector(selectIsAdmin);

  const [editingTask, setEditingTask] = useState(null);

  // --- Эффект для загрузки задач ---
  useEffect(() => {
    dispatch(fetchTasks({ page: 1, sort_field: sortField, sort_dir: sortDirection }));
  }, [dispatch, sortField, sortDirection]);

  // --- Добавлено: Эффект для синхронизации logout между вкладками ---
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'token') {
        // console.log('App: localStorage "token" changed in another tab.');
        if (event.newValue === null) {
          // Токен был удален в другой вкладке (logout)
          // console.log('App: Token removed in another tab, dispatching storageLogout.');
          dispatch(storageLogout());
        } else {
          // Токен был добавлен/изменен (login или другой токен)
          // console.log('App: Token changed in another tab (new value: ', event.newValue, ')');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch]); // Зависимость от dispatch
  // --- Конец добавления ---

  // --- Эффект для обработки CustomEvent (если используется где-то еще) ---
  // Если вы убрали использование forceCloseEditModal из EditTaskModal, этот useEffect можно удалить.
  useEffect(() => {
    const handleForceClose = () => {
      // console.log("App: Received forceCloseEditModal event.");
      setEditingTask(null);
    };

    window.addEventListener('forceCloseEditModal', handleForceClose);
    return () => {
      window.removeEventListener('forceCloseEditModal', handleForceClose);
    };
  }, []); // Пустой массив зависимостей - запускается только при монтировании/размонтировании

  let content;

  if (status === 'loading') {
    content = <div>Loading tasks...</div>;
  } else if (status === 'failed') {
    content = <div className="admin-message error">Error: {error}</div>;
  } else if (status === 'succeeded') {
    if (!tasks || tasks.length === 0) {
      content = <div>No tasks found.</div>;
    } else {
      content = (
        <ul>
          {tasks.map((task) => {
            if (!task) {
              console.warn("App: Encountered undefined task in tasks list");
              return null;
            }
            return (
              <li key={task.id}>
                <div><strong>{task.username}</strong> ({task.email})</div>
                <div style={{ marginTop: '5px' }}>
                  {task.text}
                  {task.isCompleted && <span className="completed-task"> - Completed</span>}
                  {/* --- Отображение отметки "отредактировано администратором" --- */}
                  {task.isAdminEdited && <span className="admin-edited-task"> (edited by admin)</span>}
                  {/* --- Конец отображения отметки --- */}
                </div>
                {isAdmin && (
                  <button
                    onClick={() => {
                      if (task && task.id !== undefined) {
                        setEditingTask(task);
                      } else {
                        console.error("App: Cannot set editingTask, task or task.id is undefined", task);
                      }
                    }}
                    className="edit-task-btn"
                  >
                    Edit
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      );
    }
  }

  const handleRefresh = () => {
    dispatch(fetchTasks({ page: currentPage, sort_field: sortField, sort_dir: sortDirection }));
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <LoginForm />
      <CreateTaskForm />
      <hr />
      <h2>Task List</h2>
      <SortControls />
      {content}
      <Pagination />
      <button onClick={handleRefresh}>Refresh Tasks</button>

      {/* --- Рендеринг модального окна редактирования --- */}
      {editingTask && editingTask.id !== undefined && (
        <EditTaskModal
          key={editingTask.id}
          task={editingTask}
          onClose={() => {
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}

export default App;