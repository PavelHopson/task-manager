// frontend/src/components/EditTaskModal.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask } from '../features/tasks/tasksSlice';
import { selectAuthToken } from '../features/auth/authSlice';

const EditTaskModal = ({ task, onClose }) => {
  // --- Проверка входных данных ---
  if (!task) {
    console.error('EditTaskModal: Critical Error - task prop is missing or null.');
    return null;
  }

  // Используем hasOwnProperty для безопасности
  if (!task.hasOwnProperty('id')) {
     console.error('EditTaskModal: Critical Error - task.id is missing.', task);
     return <div className="modal-overlay"><div className="modal-content admin-message error">Ошибка: Неверные данные задачи (отсутствует ID).</div></div>;
  }

  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);

  const [text, setText] = useState(task.text || '');
  const [isCompleted, setIsCompleted] = useState(task.isCompleted || false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Сброс формы и состояния при изменении задачи
    setText(task.text || '');
    setIsCompleted(task.isCompleted || false);
    setIsUpdating(false);
    setMessage({ type: '', text: '' });
  }, [task]);

  const handleTextChange = (e) => setText(e.target.value);
  const handleCheckboxChange = (e) => setIsCompleted(e.target.checked);

    const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Базовые проверки ---
    if (!task || !task.hasOwnProperty('id')) {
        const errorMsg = 'EditTaskModal.handleSubmit: Aborted - task or task.id is missing.';
        console.error(errorMsg);
        setMessage({ type: 'error', text: errorMsg });
        return;
    }
    if (!token) {
        const errorMsg = 'EditTaskModal.handleSubmit: Aborted - Authorization token is missing.';
        console.error(errorMsg);
        setMessage({ type: 'error', text: errorMsg });
        return;
    }
    if (isUpdating) {
        console.warn('EditTaskModal.handleSubmit: Update already in progress.');
        return;
    }

    setIsUpdating(true);
    setMessage({ type: '', text: '' });

    try {
      // --- Отправка запроса ---
      console.log("EditTaskModal.handleSubmit: Dispatching updateTask for task ID:", task.id);
      const resultAction = await dispatch(updateTask({
        taskId: task.id,
        updateData: { text, isCompleted },
        token
      }));
      console.log("EditTaskModal.handleSubmit: Dispatch result received:", resultAction);

      // --- Проверка результата ---
      if (resultAction.type && resultAction.type.endsWith('/fulfilled')) {
        console.log('EditTaskModal.handleSubmit: SUCCESS - Task updated.', resultAction.payload);
        setMessage({ type: 'success', text: 'Task updated successfully!' });

        // --- БЕЗОПАСНОЕ закрытие без сложной логики ---
        // Просто вызываем onClose через минимальную задержку
        setTimeout(() => {
          console.log("EditTaskModal.handleSubmit: Timeout finished. Attempting to call onClose.");
          // Используем прямую проверку и вызов
          try {
            if (onClose && typeof onClose === 'function') {
              console.log("EditTaskModal.handleSubmit: Calling onClose().");
              onClose();
              console.log("EditTaskModal.handleSubmit: onClose() called successfully.");
            } else {
              console.error("EditTaskModal.handleSubmit: CRITICAL - onClose is not a callable function!", typeof onClose);
              // Абсолютно последний шаг: принудительно удаляем модалку через состояние App
              // Это требует дополнительной настройки в App.jsx, которую мы сделали ранее.
              // window.dispatchEvent(new CustomEvent('forceCloseEditModal'));
            }
          } catch (closeError) {
             // Ловим любые ошибки, возникающие *при вызове* onClose
             console.error("EditTaskModal.handleSubmit: ERROR caught while calling onClose():", closeError);
             // Даже если onClose сломан, мы должны остановить индикатор загрузки
             setIsUpdating(false);
          }
        }, 1500); // Задержка 1.5 секунды

        // ВАЖНО: Не устанавливаем setIsUpdating(false) здесь,
        // потому что модальное окно может закрыться до завершения этого блока.
        // setIsUpdating будет сброшен при следующем рендере компонента (useEffect при изменении task)
        // или если onClose не сработает и таймер истечет с ошибкой (см. catch выше).

      } else {
        // --- Ошибка ---
        console.log('EditTaskModal.handleSubmit: ERROR - Failed to update task.');
        let errorMessage = 'Unknown error occurred.';
        // Проверяем стандартные поля ошибки Redux Toolkit
        if (resultAction.payload) {
          errorMessage = resultAction.payload;
        } else if (resultAction.error && resultAction.error.message) {
          errorMessage = resultAction.error.message;
        }
        console.error('EditTaskModal.handleSubmit: Error details:', errorMessage);
        setMessage({ type: 'error', text: `Failed to update task: ${errorMessage}` });
        // Разрешаем повторную отправку при ошибке
        setIsUpdating(false);
      }

    } catch (err) {
      // --- Неожиданная синхронная ошибка ---
      console.error('EditTaskModal.handleSubmit: UNEXPECTED SYNCHRONOUS ERROR:', err);
      const errorMsg = `Unexpected error: ${err.message}`;
      setMessage({ type: 'error', text: errorMsg });
      // Разрешаем повторную отправку при ошибке
      setIsUpdating(false);
    }
    // finally блок убран, чтобы избежать преждевременного сброса isUpdating
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Кнопка закрытия */}
        <button
          onClick={() => {
             console.log("EditTaskModal: Close button clicked.");
             if (onClose && typeof onClose === 'function') {
                 console.log("EditTaskModal: Close button - Calling onClose()...");
                 onClose();
                 console.log("EditTaskModal: Close button - onClose() called successfully.");
             } else {
                 console.error("EditTaskModal: Close button - onClose is not a function!", typeof onClose);
             }
          }}
          className="modal-close-button"
          aria-label="Close"
          disabled={isUpdating}
        >
          &times;
        </button>
        
        {/* Заголовок с ID задачи */}
        <h2>Edit Task (ID: {task.id})</h2>
        
        {/* Сообщение об успехе/ошибке */}
        {message.text && (
          <div className={`admin-message ${message.type === 'error' ? 'error' : 'success'}`} style={{ marginBottom: '15px' }}>
            {message.text}
          </div>
        )}

        {/* Форма редактирования */}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="edit-username"><strong>Username:</strong></label>
            <p id="edit-username">{task.username}</p>
          </div>
          <div>
            <label htmlFor="edit-email"><strong>Email:</strong></label>
            <p id="edit-email">{task.email}</p>
          </div>
          <div>
            <label htmlFor="edit-text">Task Text:</label>
            <textarea
              id="edit-text"
              value={text}
              onChange={handleTextChange}
              rows="4"
              required
              disabled={isUpdating}
            />
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={handleCheckboxChange}
                disabled={isUpdating}
              />
              Completed
            </label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
            {/* Кнопка Cancel */}
            <button
              type="button"
              onClick={() => {
                 console.log("EditTaskModal: Cancel button clicked.");
                 if (onClose && typeof onClose === 'function') {
                     console.log("EditTaskModal: Cancel button - Calling onClose()...");
                     onClose();
                     console.log("EditTaskModal: Cancel button - onClose() called successfully.");
                 } else {
                     console.error("EditTaskModal: Cancel button - onClose is not a function!", typeof onClose);
                 }
              }}
              className="cancel-btn"
              disabled={isUpdating}
            >
              Cancel
            </button>
            {/* Кнопка Update Task */}
            <button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;