import type { UserLogin } from "../interfaces/UserLogin";

const DB_URL = import.meta.env.VITE_DB_URL || "http://localhost:5000";

const login = async (userInfo: UserLogin): Promise<any> => {
  try {
    const response = await fetch(`${DB_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    },);

    if (!response.ok) {
      throw new Error("User information not retrieved, check network tab!");
    }

    return await response.json();
  } catch (err) {
    console.log("Error from user login: ", err);
    return Promise.reject("Could not fetch user info");
  }
};

export { login };
