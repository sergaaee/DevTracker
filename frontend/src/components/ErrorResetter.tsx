import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ErrorResetter = () => {
  const { clearError } = useAuth();
  const location = useLocation();
  const previousPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    // Проверяем, изменился ли маршрут
    if (previousPathnameRef.current !== location.pathname && location.pathname === "/register" || location.pathname === "/login") {
      console.log("ErrorResetter: Resetting error on route change", location.pathname);
      clearError();
    }

    // Обновляем предыдущий маршрут
    previousPathnameRef.current = location.pathname;
  }, [location.pathname, clearError]);

  return null;
};