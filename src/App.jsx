import { useState, useEffect } from "react";
import { useGameStore } from "./store/gameStore";
import { useGame } from "./hooks/useGame";
import Board from "./components/Game/Board";
import GameStatus from "./components/Game/GameStatus";
import ThemeToggle from "./components/UI/ThemeToggle";
import Modal from "./components/UI/Modal";
import SettingsPanel from "./components/UI/SettingsPanel";
import WinScreen from "./components/Results/WinScreen";
import LoseScreen from "./components/Results/LoseScreen";
import DrawScreen from "./components/Results/DrawScreen";
import { initData } from "@telegram-apps/sdk";

initData();

function App() {
  const { winner, isDraw, gameOver, initTheme, stats } = useGameStore();
  const { resetGame } = useGame();
  const [showSettings, setShowSettings] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Инициализация темы при загрузке
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // Показываем результат после окончания игры с небольшой задержкой
  useEffect(() => {
    if (gameOver) {
      const timer = setTimeout(() => {
        setShowResult(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setShowResult(false);
    }
  }, [gameOver]);

  const handlePlayAgain = () => {
    setShowResult(false);
    resetGame();
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen min-h-dvh gradient-bg flex flex-col">
      {/* Хедер */}
      <header className="flex items-center justify-between p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎮</span>
          <h1 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
            Крестики-нолики
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className="
              p-3 rounded-full
              bg-[var(--bg-card)]
              border border-[var(--border)]
              shadow-sm
              transition-all duration-300
              hover:shadow-md hover:scale-105
              active:scale-95
            "
            aria-label="Настройки"
          >
            <span className="text-xl">⚙️</span>
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Основной контент */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        {/* Статистика */}
        <div className="mb-4 flex items-center gap-4 text-sm">
          <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
            🏆 {stats.wins}
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
            🤝 {stats.draws}
          </span>
          <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300">
            💔 {stats.losses}
          </span>
        </div>

        {/* Статус игры */}
        <GameStatus />

        {/* Игровое поле */}
        <Board />

        {/* Кнопка новой игры (если игра завершена, но модалка ещё не показана) */}
        {gameOver && !showResult && (
          <button
            onClick={handlePlayAgain}
            className="
              mt-6 px-6 py-3
              bg-[var(--accent)]
              text-white font-medium
              rounded-soft
              shadow-md
              transition-all duration-300
              hover:shadow-lg hover:scale-[1.02]
              active:scale-95
              animate-fadeIn
            "
          >
            🔄 Новая игра
          </button>
        )}
      </main>

      {/* Подсказка */}
      <footer className="text-center pb-6 px-4">
        <p className="text-sm text-[var(--text-secondary)]">
          Выиграй и получи промокод на скидку! 🎁
        </p>
        <div>{initData}</div>
      </footer>

      {/* Модальное окно настроек */}
      <Modal isOpen={showSettings} onClose={handleCloseSettings}>
        <SettingsPanel onClose={handleCloseSettings} />
      </Modal>

      {/* Модальное окно результата */}
      <Modal isOpen={showResult} onClose={() => {}}>
        {winner === "X" && <WinScreen onPlayAgain={handlePlayAgain} />}
        {winner === "O" && <LoseScreen onPlayAgain={handlePlayAgain} />}
        {isDraw && <DrawScreen onPlayAgain={handlePlayAgain} />}
      </Modal>
    </div>
  );
}

export default App;
