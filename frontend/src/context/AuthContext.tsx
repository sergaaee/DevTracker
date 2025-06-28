// AuthContext.tsx
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  isLoading: boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("access_token");
      const storedUsername = localStorage.getItem("username");

      if (token && storedUsername) {
        axios.defaults.headers["Authorization"] = `Bearer ${token}`;
        try {
          const response = await axios.get("http://localhost:8000/api/v1/user", {
            params: { username: storedUsername },
          });
          const userData: User = {
            id: response.data.id.toString(),
            username: response.data.username,
            email: response.data.email,
          };
          setUser(userData);
        } catch (e: any) {
          console.error("Failed to initialize user:", e);
          console.error("Error response:", e.response?.data);
          setError("Не удалось загрузить данные пользователя. Попробуйте войти снова.");
          localStorage.removeItem("access_token");
          localStorage.removeItem("username");
          delete axios.defaults.headers["Authorization"];
        }
      } else {
        console.log("No token or username in localStorage");
      }
      setIsLoading(false);
    };

    initializeUser();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/v1/auth/login/", {
        username,
        password,
      });
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("username", response.data.user.username);
      axios.defaults.headers["Authorization"] = `Bearer ${response.data.access_token}`;
      const userData: User = {
        id: response.data.user.id.toString(),
        username: response.data.user.username,
        email: response.data.user.email,
      };
      setUser(userData);
      setError(null);
    } catch (e: any) {
      setError(e.response?.data?.detail || "Ошибка входа. Попробуйте еще раз.");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/v1/auth/register/", {
        username,
        email,
        password,
      });
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("username", response.data.user.username);
      axios.defaults.headers["Authorization"] = `Bearer ${response.data.access_token}`;
      const userData: User = {
        id: response.data.user.id.toString(),
        username: response.data.user.username,
        email: response.data.user.email,
      };
      setUser(userData);
      setError(null);
    } catch (e: any) {
      if (e.response?.status === 400) {
        setError("Пользователь с таким логином или почтой уже существует.");
      }
      else if (e.response?.status === 422) {
        setError("Некорректный формат для почты.");
      }
      else {
        console.error("Registration error:", e);
      }
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    setUser(null);
    setError(null);
    delete axios.defaults.headers["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, error, isLoading, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};