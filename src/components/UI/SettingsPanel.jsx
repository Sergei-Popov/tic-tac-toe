import {
  useGameStore,
  SYMBOL_OPTIONS,
  COLOR_SCHEMES,
} from "../../store/gameStore";
import { selectionFeedback } from "../../utils/telegram";

export default function SettingsPanel({ onClose }) {
  const {
    symbolSet,
    setSymbolSet,
    colorScheme,
    setColorScheme,
    difficulty,
    setDifficulty,
    resetGame,
  } = useGameStore();

  const handleSymbolChange = (newSymbolSet) => {
    selectionFeedback();
    setSymbolSet(newSymbolSet);
  };

  const handleColorChange = (newColorScheme) => {
    selectionFeedback();
    setColorScheme(newColorScheme);
  };

  const handleDifficultyChange = (newDifficulty) => {
    selectionFeedback();
    setDifficulty(newDifficulty);
    resetGame();
  };

  return (
    <div className="animate-slideUp p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          ⚙️ Настройки
        </h2>
        <button
          onClick={onClose}
          className="
            p-2 rounded-full
            hover:bg-[var(--bg-secondary)]
            transition-colors duration-200
          "
          aria-label="Закрыть настройки"
        >
          ✕
        </button>
      </div>

      {/* Выбор символов */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
          Символы
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SYMBOL_OPTIONS.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSymbolChange(option)}
              className={`
                p-3 rounded-soft
                border-2 transition-all duration-200
                ${
                  symbolSet.name === option.name
                    ? "border-[var(--accent)] bg-[var(--accent)]/10"
                    : "border-[var(--border)] hover:border-[var(--accent)]/50"
                }
              `}
            >
              <div className="text-2xl mb-1">
                {option.x} {option.o}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                {option.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Выбор цветовой схемы */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
          Цветовая схема
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {COLOR_SCHEMES.map((scheme, index) => (
            <button
              key={index}
              onClick={() => handleColorChange(scheme)}
              className={`
                p-3 rounded-soft
                border-2 transition-all duration-200
                ${
                  colorScheme.name === scheme.name
                    ? "border-[var(--accent)] bg-[var(--accent)]/10"
                    : "border-[var(--border)] hover:border-[var(--accent)]/50"
                }
              `}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <span
                  className="w-6 h-6 rounded-full border border-[var(--border)]"
                  style={{ backgroundColor: scheme.x }}
                />
                <span
                  className="w-6 h-6 rounded-full border border-[var(--border)]"
                  style={{ backgroundColor: scheme.o }}
                />
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                {scheme.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Выбор сложности */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
          Сложность
        </h3>
        <div className="flex gap-2">
          {[
            { value: "easy", label: "Легко", emoji: "😊" },
            { value: "medium", label: "Средне", emoji: "🤔" },
            { value: "hard", label: "Сложно", emoji: "😈" },
          ].map((level) => (
            <button
              key={level.value}
              onClick={() => handleDifficultyChange(level.value)}
              className={`
                flex-1 p-3 rounded-soft
                border-2 transition-all duration-200
                ${
                  difficulty === level.value
                    ? "border-[var(--accent)] bg-[var(--accent)]/10"
                    : "border-[var(--border)] hover:border-[var(--accent)]/50"
                }
              `}
            >
              <div className="text-xl mb-1">{level.emoji}</div>
              <div className="text-xs text-[var(--text-secondary)]">
                {level.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onClose}
        className="
          w-full py-3
          bg-[var(--accent)]
          text-white font-medium
          rounded-soft
          transition-all duration-200
          hover:opacity-90
          active:scale-98
        "
      >
        Готово
      </button>
    </div>
  );
}
