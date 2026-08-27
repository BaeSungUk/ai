import { createContext, useContext, useState } from "react";
import { authApi } from "../api/index.js";
const C = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("stayhub_user") || "null"),
  );
  async function login(v) {
    const x = await authApi.login(v);
    localStorage.setItem("stayhub_token", x.token);
    localStorage.setItem("stayhub_user", JSON.stringify(x.user));
    setUser(x.user);
  }
  function logout() {
    localStorage.removeItem("stayhub_token");
    localStorage.removeItem("stayhub_user");
    setUser(null);
  }
  return (
    <C.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </C.Provider>
  );
}
export const useAuth = () => useContext(C);
