import { jwtDecode, JwtPayload } from "jwt-decode";

class AuthService {
  getUserProfile() {
    const token = this.getToken();
    if (token) {
      if (!this.checkTokenExpiry(token)) {
        return jwtDecode(token);
      }
    }
    return null;
  }

  loggedIn() {
    const token = localStorage.getItem("token");
    return !!token && !this.checkTokenExpiry(token);
  }

  checkTokenExpiry(token: string) {
    try {
      const decoded: JwtPayload = jwtDecode(token);
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token decoding failed:", error);
      return true;
    }
  }

  getToken() {
    return localStorage.getItem("token");
  }

  login(token: string) {
    localStorage.setItem("token", token);
    window.location.assign("/");
    window.history.pushState({}, "", "/");
  }

  logout() {
    localStorage.removeItem("token");
    window.location.assign("/");
  }
}

export default new AuthService();
