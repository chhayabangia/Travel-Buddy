// User Login Page 
import { useState, FormEvent, ChangeEvent } from "react";
import Auth from '../utils/auth';
import { login } from "../api/authAPI";
import "./../css/global.css";

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(loginData);
      Auth.login(data.token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="login-form">
      {/* Username Field */}
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={loginData.username}
          onChange={handleInputChange}
          placeholder="Enter your username"
          title="Please enter your username"
          aria-label="Username"
          required
        />
      </div>

      {/* Password Field */}
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={loginData.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          title="Please enter your password"
          aria-label="Password"
          required
        />
      </div>

      {/* Login Button */}
      <button type="submit" title="Click to log in">
        🔐 Login
      </button>
    </form>
  );
};

export default Login;
