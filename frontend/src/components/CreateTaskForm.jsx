import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, selectTasksStatus } from '../features/tasks/tasksSlice';

const schema = yup.object({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  text: yup.string().required('Task text is required'),
}).required();

const CreateTaskForm = () => {
  const dispatch = useDispatch();
  const taskCreationStatus = useSelector(selectTasksStatus);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const resultAction = await dispatch(createTask(data));
    if (createTask.fulfilled.match(resultAction)) {
      console.log('Task created successfully:', resultAction.payload);
      alert('Task created successfully!');
      reset();
    } else {
      console.error('Failed to create task:', resultAction.payload);
      alert(`Failed to create task: ${resultAction.payload}`);
    }
  };

  const isCreating = taskCreationStatus === 'loading';

  return (
    <div> {/* Можно добавить класс обертки, если нужно, но форма уже стилизована */}
      <h2>Create New Task</h2>
      <form onSubmit={handleSubmit(onSubmit)}> {/* Стили для form в App.css применятся */}
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            {...register('username')}
          />
          {errors.username && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.username.message}</p>}
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            {...register('email')}
          />
          {errors.email && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="text">Task Text:</label>
          <textarea
            id="text"
            {...register('text')}
            rows="4"
          />
          {errors.text && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.text.message}</p>}
        </div>

        <button type="submit" disabled={isCreating}> {/* Стили для button в App.css применятся */}
          {isCreating ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default CreateTaskForm;