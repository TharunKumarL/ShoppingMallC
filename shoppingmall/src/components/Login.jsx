import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
// import './login.css'; // Import the CSS file
import './css/login.css';

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const role = document.querySelector('select[name="role"]').value;
    login(credentials, role);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="role">Role</label>
          <select name="role" onChange={handleChange}>
            <option value="customer">Customer</option>
            <option value="owner">Restaurant Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">Login</button>
        {/* Add error message handling if needed */}
        {/* <div className="error-message">{errorMessage}</div> */}
      </form>
    </div>
  );
}

export default Login;
