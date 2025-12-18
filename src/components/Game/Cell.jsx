import { useGameStore } from "../../store/gameStore";
import { hapticFeedback, selectionFeedback } from "../../utils/telegram";

export default function Cell({ index, value, isWinCell }) {
  const { makeMove, gameOver, symbolSet, colorScheme } = useGameStore();

  const handleClick = () => {
    if (value || gameOver) return;

    selectionFeedback();
    const moved = makeMove(index);
    if (moved) {
      hapticFeedback("light");
    }
  };

  const getSymbol = () => {
    if (!value) return null;
    return value === "X" ? symbolSet.x : symbolSet.o;
  };

  const getSymbolColor = () => {
    if (!value) return "";
    return value === "X" ? colorScheme.x : colorScheme.o;
  };

  const isEmoji = (symbol) => {
    return symbol && symbol.length > 1;
  };

  return (
    <button
      onClick={handleClick}
      disabled={gameOver || value}
      className={`
        relative aspect-square rounded-soft
        flex items-center justify-center
        text-4xl sm:text-5xl md:text-6xl font-bold
        transition-all duration-300 ease-out
        cursor-pointer
        ${
          isWinCell
            ? "bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] scale-105 shadow-lg"
            : "bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)]"
        }
        ${
          !value && !gameOver
            ? "hover:scale-[1.02] hover:shadow-md active:scale-95"
            : ""
        }
        border border-[var(--border)]
        disabled:cursor-default
        focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2
      `}
      style={{
        background: isWinCell ? undefined : "var(--cell-bg)",
      }}
      aria-label={
        value ? `Ячейка ${index + 1}: ${value}` : `Пустая ячейка ${index + 1}`
      }
    >
      {value && (
        <span
          className={`
            animate-fadeIn
            ${isEmoji(getSymbol()) ? "" : "font-sans"}
            ${isWinCell ? "animate-pulse-soft" : ""}
          `}
          style={{
            color: isEmoji(getSymbol()) ? undefined : getSymbolColor(),
            textShadow: isWinCell ? "0 2px 10px rgba(0,0,0,0.2)" : "none",
          }}
        >
          {getSymbol()}
        </span>
      )}

      {/* Hover эффект для пустых ячеек */}
      {!value && !gameOver && (
        <span
          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-20 transition-opacity duration-200"
          style={{ color: colorScheme.x }}
        >
          {symbolSet.x}
        </span>
      )}
    </button>
  );
}
