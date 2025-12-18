import { create } from "zustand";
import { persist } from "zustand/middleware";

// Варианты символов для кастомизации
export const SYMBOL_OPTIONS = [
  { x: "✕", o: "○", name: "Классика" },
  { x: "🌸", o: "🦋", name: "Цветы" },
  { x: "💜", o: "💖", name: "Сердечки" },
  { x: "🌿", o: "🌺", name: "Природа" },
  { x: "⭐", o: "🌙", name: "Космос" },
  { x: "🍓", o: "🍊", name: "Фрукты" },
];

// Цветовые схемы
export const COLOR_SCHEMES = [
  { name: "Розовый закат", x: "#D4A5A5", o: "#A5C4D4", accent: "#D4A5A5" },
  { name: "Лавандовый", x: "#9B8AA5", o: "#A5C4A5", accent: "#9B8AA5" },
  { name: "Персиковый", x: "#E6B89C", o: "#9CB8E6", accent: "#E6B89C" },
  { name: "Мятный", x: "#8FBC8F", o: "#BC8F8F", accent: "#8FBC8F" },
];

// Начальное состояние доски
const INITIAL_BOARD = Array(9).fill(null);

// Проверка победителя
const checkWinner = (board) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Горизонтали
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Вертикали
    [0, 4, 8],
    [2, 4, 6], // Диагонали
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }

  return null;
};

// Проверка на ничью
const checkDraw = (board) => {
  return board.every((cell) => cell !== null);
};

// Генерация промокода
const generatePromoCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const useGameStore = create(
  persist(
    (set, get) => ({
      // Состояние игры
      board: INITIAL_BOARD,
      currentPlayer: "X",
      winner: null,
      winLine: null,
      isDraw: false,
      gameOver: false,
      promoCode: null,

      // Статистика
      stats: {
        wins: 0,
        losses: 0,
        draws: 0,
      },

      // Кастомизация
      symbolSet: SYMBOL_OPTIONS[0],
      colorScheme: COLOR_SCHEMES[0],
      difficulty: "medium", // easy, medium, hard

      // Тема
      theme: "light",

      // Действия
      makeMove: (index) => {
        const { board, currentPlayer, gameOver } = get();

        if (board[index] || gameOver) return false;

        const newBoard = [...board];
        newBoard[index] = currentPlayer;

        const result = checkWinner(newBoard);
        const isDraw = !result && checkDraw(newBoard);

        set({
          board: newBoard,
          winner: result?.winner || null,
          winLine: result?.line || null,
          isDraw,
          gameOver: !!result || isDraw,
          currentPlayer: currentPlayer === "X" ? "O" : "X",
        });

        return true;
      },

      setWinResult: (winner) => {
        const { stats } = get();

        if (winner === "X") {
          // Игрок победил
          const promoCode = generatePromoCode();
          set({
            promoCode,
            stats: { ...stats, wins: stats.wins + 1 },
          });
          return promoCode;
        } else if (winner === "O") {
          // Компьютер победил
          set({
            stats: { ...stats, losses: stats.losses + 1 },
          });
        }
        return null;
      },

      setDrawResult: () => {
        const { stats } = get();
        set({
          stats: { ...stats, draws: stats.draws + 1 },
        });
      },

      resetGame: () => {
        set({
          board: INITIAL_BOARD,
          currentPlayer: "X",
          winner: null,
          winLine: null,
          isDraw: false,
          gameOver: false,
          promoCode: null,
        });
      },

      setSymbolSet: (symbolSet) => set({ symbolSet }),

      setColorScheme: (colorScheme) => set({ colorScheme }),

      setDifficulty: (difficulty) => set({ difficulty }),

      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", newTheme);
        set({ theme: newTheme });
      },

      initTheme: () => {
        const { theme } = get();
        document.documentElement.setAttribute("data-theme", theme);
      },
    }),
    {
      name: "tic-tac-toe-storage",
      partialize: (state) => ({
        stats: state.stats,
        symbolSet: state.symbolSet,
        colorScheme: state.colorScheme,
        difficulty: state.difficulty,
        theme: state.theme,
      }),
    },
  ),
);
