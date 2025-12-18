import { useGameStore } from "../../store/gameStore";

export default function GameStatus() {
  const { currentPlayer, winner, isDraw, gameOver, symbolSet } = useGameStore();

  const getStatusMessage = () => {
    if (winner) {
      return winner === "X" ? "🎉 Вы победили!" : "😔 Компьютер победил";
    }
    if (isDraw) {
      return "🤝 Ничья!";
    }
    return currentPlayer === "X" ? "Ваш ход" : "Ход компьютера...";
  };

  const getCurrentSymbol = () => {
    if (gameOver) return null;
    return currentPlayer === "X" ? symbolSet.x : symbolSet.o;
  };

  return (
    <div className="text-center mb-6">
      <div
        className={`
          inline-flex items-center gap-3 
          px-6 py-3 
          rounded-full
          bg-[var(--bg-card)]
          border border-[var(--border)]
          shadow-sm
          transition-all duration-300
          ${winner === "X" ? "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30" : ""}
          ${winner === "O" ? "bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30" : ""}
          ${isDraw ? "bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30" : ""}
        `}
      >
        {getCurrentSymbol() && (
          <span className="text-2xl animate-bounce-soft">
            {getCurrentSymbol()}
          </span>
        )}
        <span
          className={`
            text-lg font-medium
            text-[var(--text-primary)]
            ${gameOver ? "text-xl" : ""}
          `}
        >
          {getStatusMessage()}
        </span>
      </div>
    </div>
  );
}
