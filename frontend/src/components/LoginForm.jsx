import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectAuthStatus, selectAuthError, logout, selectIsAdmin } from '../features/auth/authSlice';

const LoginForm = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const isAdmin = useSelector(selectIsAdmin);

  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(credentials));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (isAdmin) {
    return (
      <div className="admin-message success">
        <p><strong>Admin is logged in.</strong></p>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Admin Login</h2>
      {error && <p className="admin-message error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          {/* --- ИЗМЕНЕНО: Уникальный id --- */}
          <label htmlFor="login-username">Username:</label>
          <input
            type="text"
            id="login-username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          {/* --- ИЗМЕНЕНО: Уникальный id --- */}
          <label htmlFor="login-password">Password:</label>
          <input
            type="password"
            id="login-password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;