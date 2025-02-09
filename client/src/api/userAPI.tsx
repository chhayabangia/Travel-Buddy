import Auth from "../utils/auth";
const DB_URL = process.env.REACT_APP_DB_URL || "http://localhost:5000";

interface User {
  id: string;
  username: string;
  email: string;
}

const retrieveUsers = async (): Promise<User[]> => {
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

export { retrieveUsers };
