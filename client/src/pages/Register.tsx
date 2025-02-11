// User registration page
import { ChangeEvent, FormEvent, useState } from "react";
import { createUser } from "../api/userAPI";
import type { UserData } from "../interfaces/UserData";
import { useNavigate } from "react-router-dom";

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
      <input
        type="text"
        name="username"
        value={newUser.username}
        onChange={handleInputChange}
      />
      <input
        type="password"
        name="password"
        value={newUser.password}
        onChange={handleInputChange}
      />
      <button type="submit">Register</button>
    </form>
    </div>
  );
};

export default RegisterForm;