// Minimax алгоритм для AI

// Проверка победителя
const checkWinner = (board) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

// Получить доступные ходы
const getAvailableMoves = (board) => {
  return board
    .map((cell, index) => (cell === null ? index : null))
    .filter((index) => index !== null);
};

// Minimax алгоритм
const minimax = (board, depth, isMaximizing, alpha, beta) => {
  const winner = checkWinner(board);

  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (getAvailableMoves(board).length === 0) return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let move of getAvailableMoves(board)) {
      const newBoard = [...board];
      newBoard[move] = "O";
      const evaluation = minimax(newBoard, depth + 1, false, alpha, beta);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let move of getAvailableMoves(board)) {
      const newBoard = [...board];
      newBoard[move] = "X";
      const evaluation = minimax(newBoard, depth + 1, true, alpha, beta);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

// Получить лучший ход для AI
export const getBestMove = (board, difficulty = "medium") => {
  const availableMoves = getAvailableMoves(board);

  if (availableMoves.length === 0) return null;

  // Легкий уровень - случайный ход с 70% вероятностью
  if (difficulty === "easy") {
    if (Math.random() < 0.7) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
  }

  // Средний уровень - случайный ход с 30% вероятностью
  if (difficulty === "medium") {
    if (Math.random() < 0.3) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
  }

  // Сложный уровень или оставшиеся 30%/70% - minimax
  let bestMove = availableMoves[0];
  let bestScore = -Infinity;

  for (let move of availableMoves) {
    const newBoard = [...board];
    newBoard[move] = "O";
    const score = minimax(newBoard, 0, false, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
};

// Проверка, может ли кто-то выиграть следующим ходом
export const getWinningMove = (board, player) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    const values = [board[a], board[b], board[c]];
    const playerCount = values.filter((v) => v === player).length;
    const emptyCount = values.filter((v) => v === null).length;

    if (playerCount === 2 && emptyCount === 1) {
      const emptyIndex = line[values.indexOf(null)];
      return emptyIndex;
    }
  }

  return null;
};
