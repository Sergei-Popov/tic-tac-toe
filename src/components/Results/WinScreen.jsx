import { useGameStore } from "../../store/gameStore";
import { celebrateWin } from "../../utils/confetti";
import { notificationFeedback } from "../../utils/telegram";

const positiveMessages = [
  "✨ Потрясающе!",
  "🌟 Великолепно!",
  "💫 Вы восхитительны!",
  "🎊 Блестящая победа!",
  "🌸 Прекрасная игра!",
  "💖 Вы лучшая!",
  "🦋 Волшебно!",
  "🌺 Чудесно!",
];

export default function WinScreen({ onPlayAgain }) {
  const { promoCode, stats } = useGameStore();

  const randomMessage =
    positiveMessages[Math.floor(Math.random() * positiveMessages.length)];

  const handlePlayAgain = () => {
    notificationFeedback("success");
    onPlayAgain();
  };

  return (
    <div className="animate-slideUp text-center p-6 sm:p-8">
      <div className="mb-6">
        <div className="text-6xl sm:text-7xl mb-4 animate-bounce-soft">🎉</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
          Победа!
        </h2>
        <p className="text-lg text-[var(--text-secondary)]">{randomMessage}</p>
      </div>

      {promoCode && (
        <div className="mb-8">
          <p className="text-sm text-[var(--text-secondary)] mb-2">
            Ваш промокод на скидку:
          </p>
          <div
            className="
              inline-block
              px-6 py-4
              bg-gradient-to-r from-[var(--pastel-pink)] to-[var(--pastel-lavender)]
              rounded-softer
              shadow-lg
            "
          >
            <span className="text-3xl sm:text-4xl font-bold tracking-widest text-[var(--deep-violet)]">
              {promoCode}
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-3">
            Промокод отправлен вам в чат 💬
          </p>
        </div>
      )}

      <div className="mb-6 p-4 bg-[var(--bg-card)] rounded-soft border border-[var(--border)]">
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
    </div>
  );
}
