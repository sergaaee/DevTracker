// Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isLoading) {
    return null;
  }

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div>
        <Link to="/" className="text-xl font-bold text-blue-400">
          DevTracker
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link
              to={`/profile/${user?.username || "unknown"}`}
              className="text-gray-300 hover:text-white"
            >
              Профиль
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white"
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-300 hover:text-white">
              Войти
            </Link>
            <Link to="/register" className="text-gray-300 hover:text-white">
              Регистрация
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}