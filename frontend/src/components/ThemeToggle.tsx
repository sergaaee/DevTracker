import { useTheme } from "../context/ThemeContext"

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="text-sm px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 transition"
    >
      {theme === "dark" ? "🌞 Светлая" : "🌙 Тёмная"}
    </button>
  )
}
