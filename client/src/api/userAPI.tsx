import Auth from "../utils/auth";
import type { UserData } from "../interfaces/UserData";
const DB_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const retrieveUsers = async (): Promise<UserData[]> => {
  try {
    const response = await fetch(`${DB_URL}/api/users`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Auth.getToken()}`,
      },
    });
    
    if (!response.ok) {
      throw new Error("invalid user API response, check network tab!");
    }

    return await response.json();
  } catch (err) {
    console.error("Error from data retrieval:", err);
    return [];
  }
};

const retrieveUser = async (id: number | null): Promise<UserData> => {
  try {
    const response = await fetch(`${DB_URL}/api/users/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Auth.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("invalid user API response, check network tab!");
    }

    return await response.json();
  } catch (err) {
    console.error("Error from data retrieval:", err);
    return Promise.reject("Could not fetch user info");
  }
}

const createUser = async (body: UserData): Promise<UserData> => {
  try {
    const response = await fetch(`${DB_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Auth.getToken()}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("invalid user API response, check network tab!");
    }

    return await response.json();
  } catch (err) {
    console.error("Error from user creation:", err);
    return Promise.reject("Could not create user");
  }
}

const updateUser = async (id: number | null, body: UserData): Promise<UserData> => {
  try {
    const response = await fetch(`${DB_URL}/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Auth.getToken()}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("invalid user API response, check network tab!");
    }

    return await response.json();
  } catch (err) {
    console.error("Error from user update:", err);
    return Promise.reject("Could not update user");
  }
}

const deleteUser = async (id: number | null): Promise<UserData> => {
  try {
    const response = await fetch(`${DB_URL}/api/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Auth.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("invalid user API response, check network tab!");
    }

    return await response.json();
  } catch (err) {
    console.error("Error from user deletion:", err);
    return Promise.reject("Could not delete user");
  }
}

export { retrieveUsers, retrieveUser, createUser, updateUser, deleteUser };
