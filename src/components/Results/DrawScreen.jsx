import { useGameStore } from "../../store/gameStore";
import { notificationFeedback } from "../../utils/telegram";

export default function DrawScreen({ onPlayAgain }) {
  const { stats } = useGameStore();

  const handlePlayAgain = () => {
    notificationFeedback("warning");
    onPlayAgain();
  };

  return (
    <div className="animate-slideUp text-center p-6 sm:p-8">
      <div className="mb-6">
        <div className="text-6xl sm:text-7xl mb-4">🤝</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
          Ничья!
        </h2>
        <p className="text-lg text-[var(--text-secondary)]">
          Отличная партия! Вы достойный соперник 🌟
        </p>
      </div>

      <div className="mb-8 p-4 bg-[var(--bg-card)] rounded-soft border border-[var(--border)]">
        <p className="text-sm text-[var(--text-secondary)] mb-1">
          Ваша статистика
        </p>
        <div className="flex justify-center gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-green-500">
              {stats.wins}
            </div>
            <div className="text-xs text-[var(--text-secondary)]">Побед</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-500">
              {stats.draws}
            </div>
            <div className="text-xs text-[var(--text-secondary)]">Ничьих</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-rose-500">
              {stats.losses}
            </div>
            <div className="text-xs text-[var(--text-secondary)]">
              Поражений
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handlePlayAgain}
          className="
            w-full max-w-xs
            px-8 py-4
            bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)]
            text-white font-semibold
            rounded-soft
            shadow-md
            transition-all duration-300
            hover:shadow-lg hover:scale-[1.02]
            active:scale-95
            focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2
          "
        >
          🎮 Играть ещё
        </button>

        <p className="text-sm text-[var(--text-secondary)]">
          Выиграйте и получите промокод! 🎁
        </p>
      </div>
    </div>
  );
}
