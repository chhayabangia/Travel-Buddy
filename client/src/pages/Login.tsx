<<<<<<< HEAD
// User Login page
import "./../css/global.css";

function Login() {
    return (
      <div>
        <h1>🔑 Login Page</h1>
        <p>Please enter your credentials.</p>
      </div>
    );
  }
  
  export default Login;
=======
import { useState, FormEvent, ChangeEvent } from "react";

import Auth from '../utils/auth';
import { login } from "../api/authAPI";

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
    <form onSubmit={handleFormSubmit}>
      <input type="text" name="username" value={loginData.username} onChange={handleInputChange} />
      <input type="password" name="password" value={loginData.password} onChange={handleInputChange} />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
>>>>>>> main
