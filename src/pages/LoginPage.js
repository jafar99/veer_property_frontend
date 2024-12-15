import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = credentials;

    // Dummy authentication check
    if (username === 'veer' && password === 'veer') {
      login(); // Update auth context
      navigate('/admin'); // Redirect to Admin Panel
    } else {
      setError('Invalid username or password');
    }
  };

  const handleHomepage = (e) => {
    e.preventDefault();
    navigate('/');
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>

        <button onClick={handleHomepage} className="login-button">
            Homepage
        </button>

      </form>
    </div>
  );
};

export default LoginPage;
