// Login.tsx
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const { login, error, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") && params.get("next").startsWith("/") 
    ? params.get("next") 
    : null;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginAttempted, setLoginAttempted] = useState(false);

  const handleLogin = async () => {
    try {
      await login(username, password);
      setLoginAttempted(true);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  useEffect(() => {
    if (loginAttempted && user && !isLoading) {
      const redirectTo = next || `/profile/${user.username}`;
      console.log("Redirecting to:", redirectTo);
      navigate(redirectTo, { replace: true });
    }
  }, [loginAttempted, user, isLoading, navigate, next]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="bg-gray-800 p-10 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-semibold mb-4 text-center text-blue-400">Вход в DevTracker</h2>
        <p className="text-gray-300 text-sm mb-6 text-center">
          Авторизуйтесь, чтобы продолжить
        </p>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <input
          type="text"
          placeholder="Логин"
          className="w-full p-2 mb-4 text-gray-900 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          className="w-full p-2 mb-4 text-gray-900 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors text-white font-bold"
          disabled={isLoading}
        >
          {isLoading ? "Загрузка..." : "Войти"}
        </button>
        <p className="text-center text-gray-400 mt-4">
          Нет аккаунта?{" "}
          <Link to="/register" className="text-blue-400 hover:text-blue-600">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}