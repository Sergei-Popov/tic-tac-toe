import { useGameStore } from "../../store/gameStore";
import { selectionFeedback } from "../../utils/telegram";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useGameStore();

  const handleToggle = () => {
    selectionFeedback();
    toggleTheme();
  };

  return (
    <button
      onClick={handleToggle}
      className="
        p-3
        rounded-full
        bg-[var(--bg-card)]
        border border-[var(--border)]
        shadow-sm
        transition-all duration-300
        hover:shadow-md hover:scale-105
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2
      "
      aria-label={
        theme === "light" ? "Включить тёмную тему" : "Включить светлую тему"
      }
      title={theme === "light" ? "Тёмная тема" : "Светлая тема"}
    >
      <span className="text-xl">{theme === "light" ? "🌙" : "☀️"}</span>
    </button>
  );
}
