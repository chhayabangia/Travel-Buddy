// User registration page
import { ChangeEvent, FormEvent, useState } from "react";
import { createUser } from "../api/userAPI";
import type { UserData } from "../interfaces/UserData";
import { useNavigate } from "react-router-dom";
import "./../css/global.css";

const RegisterForm = () => {
  const [newUser, setNewUser] = useState<UserData>({
    id: 0,
    username: "",
    email: "",
    password: "",
    createdAt: "",
    updatedAt: "",
  });

  const navigate = useNavigate();

  const createNewUser = async (body: UserData) => {
    try {
      const response = await createUser(body);
      console.log(response);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newUser.username && newUser.email && newUser.password) {
      const data = createNewUser(newUser);
      console.log(data);
      navigate("/");
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleFormSubmit}>
        {/* Username Field */}
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={newUser.username}
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
            value={newUser.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            title="Please enter your password"
            aria-label="Password"
            required
          />
        </div>

        {/* Login Button */}
        <button type="submit" title="Click to register">
          📝 Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;