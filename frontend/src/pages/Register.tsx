// Register.tsx
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const { register, error, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") && params.get("next").startsWith("/") 
    ? params.get("next") 
    : user ? `/profile/${user.username}` : "/profile/unknown";
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [registerAttempted, setRegisterAttempted] = useState(false);

  const handleRegister = async () => {
    try {
      await register(username, email, password);
      setSuccessMessage("Успешно зарегистрированы! Перенаправляем...");
      setRegisterAttempted(true);
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  useEffect(() => {
    if (registerAttempted && user && !isLoading) {
      console.log("User available after register, redirecting to:", `/profile/${user.username}`);
      setTimeout(() => navigate(`/profile/${user.username}`, { replace: true }), 1000);
    }
  }, [registerAttempted, user, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="bg-gray-800 p-10 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-semibold mb-4 text-center text-blue-400">Регистрация в DevTracker</h2>
        <p className="text-gray-300 text-sm mb-6 text-center">
          Создайте аккаунт, чтобы продолжить
        </p>
        {successMessage ? (
          <p className="text-green-500 text-sm text-center">{successMessage}</p>
        ) : error ? (
          <p className="text-red-500 text-sm text-center">{error}</p>
        ) : null}
        <input
          type="text"
          placeholder="Логин"
          className="w-full p-2 mb-4 text-gray-900 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 text-gray-900 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          className="w-full p-2 mb-4 text-gray-900 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleRegister}
          className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors text-white font-bold"
          disabled={isLoading}
        >
          {isLoading ? "Загрузка..." : "Зарегистрироваться"}
        </button>
        <p className="text-center text-gray-400 mt-4">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-600">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}