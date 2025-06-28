import { useAuth } from "../context/AuthContext";


export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="max-w-2xl p-10 rounded-2xl shadow-xl bg-gradient-to-br from-gray-800 to-gray-700">
        <h1 className="text-5xl font-extrabold mb-6 text-blue-400">DevTracker</h1>
        <p className="text-lg leading-relaxed text-gray-200 mb-6">
          Добро пожаловать в социальную сеть для программистов. Здесь вы можете следить за успехами друзей, подключать GitHub и Telegram, делиться достижениями и не терять мотивацию.
        </p>
        
        {isAuthenticated ? (
          <p className="text-lg text-gray-300">
            Привет, <span className="font-semibold text-blue-300">{user?.username}</span>! 
            Перейдите в <a href={`/profile/${user?.username}`} className="text-blue-400 hover:underline">ваш профиль</a>, чтобы начать.
          </p>
        ) : (
          <p className="text-lg text-gray-300">
            Пожалуйста, <a href="/login" className="text-blue-400 hover:underline">войдите</a> или <a href="/register" className="text-blue-400 hover:underline">зарегистрируйтесь</a>, чтобы продолжить.
          </p>
        )}
      </div>
    </div>
  )
}
