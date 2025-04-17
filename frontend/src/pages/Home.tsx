export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="max-w-2xl p-10 rounded-2xl shadow-xl bg-gradient-to-br from-gray-800 to-gray-700">
        <h1 className="text-5xl font-extrabold mb-6 text-blue-400">DevTracker</h1>
        <p className="text-lg leading-relaxed text-gray-200 mb-6">
          Добро пожаловать в социальную сеть для программистов. Здесь вы можете следить за успехами друзей, подключать GitHub и Telegram, делиться достижениями и не терять мотивацию.
        </p>
        <a
          href="/login"
          className="w-full py-3 mt-4 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors text-white font-bold text-center block"
        >
          Войти в DevTracker
        </a>
      </div>
    </div>
  )
}
