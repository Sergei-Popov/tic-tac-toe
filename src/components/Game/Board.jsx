import { useGameStore } from "../../store/gameStore";
import Cell from "./Cell";

export default function Board() {
  const { board, winLine } = useGameStore();

  return (
    <div className="w-full max-w-[340px] sm:max-w-[400px] mx-auto p-4">
      <div
        className="
          grid grid-cols-3 gap-3 sm:gap-4
          p-4 sm:p-5
          bg-[var(--bg-secondary)]
          rounded-softer
          shadow-lg
        "
        role="grid"
        aria-label="Игровое поле крестики-нолики"
      >
        {board.map((value, index) => (
          <Cell
            key={index}
            index={index}
            value={value}
            isWinCell={winLine?.includes(index)}
          />
        ))}
      </div>
    </div>
  );
}
