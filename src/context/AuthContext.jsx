import { createContext, useState, useEffect, useContext, useCallback } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        logout();
        return;
      }

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data = await res.json();
      setUser((prev) => (JSON.stringify(prev) !== JSON.stringify(data) ? data : prev));
    } catch (error) {
      console.error("Error validando token:", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
