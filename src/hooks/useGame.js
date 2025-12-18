import { useEffect, useCallback, useRef } from "react";
import { useGameStore } from "../store/gameStore";
import { getBestMove } from "../utils/ai";
import {
  sendWinMessage,
  sendLoseMessage,
  sendDrawMessage,
  hapticFeedback,
  notificationFeedback,
} from "../utils/telegram";
import { celebrateWin, softConfetti } from "../utils/confetti";

export function useGame() {
  const {
    board,
    currentPlayer,
    winner,
    isDraw,
    gameOver,
    difficulty,
    makeMove,
    setWinResult,
    setDrawResult,
    resetGame,
  } = useGameStore();

  const resultHandledRef = useRef(false);

  // AI делает ход
  const makeAIMove = useCallback(() => {
    if (currentPlayer !== "O" || gameOver) return;

    const aiMove = getBestMove(board, difficulty);
    if (aiMove !== null) {
      // Небольшая задержка для реалистичности
      setTimeout(
        () => {
          hapticFeedback("medium");
          makeMove(aiMove);
        },
        500 + Math.random() * 500,
      );
    }
  }, [board, currentPlayer, gameOver, difficulty, makeMove]);

  // Обработка результата игры
  const handleGameResult = useCallback(async () => {
    if (!gameOver || resultHandledRef.current) return;

    resultHandledRef.current = true;

    if (winner === "X") {
      // Игрок победил
      const promoCode = setWinResult("X");
      notificationFeedback("success");
      celebrateWin();

      if (promoCode) {
        await sendWinMessage(promoCode);
      }
    } else if (winner === "O") {
      // Компьютер победил
      setWinResult("O");
      notificationFeedback("error");
      await sendLoseMessage();
    } else if (isDraw) {
      // Ничья
      setDrawResult();
      notificationFeedback("warning");
      softConfetti();
      await sendDrawMessage();
    }
  }, [gameOver, winner, isDraw, setWinResult, setDrawResult]);

  // Сброс игры
  const handleResetGame = useCallback(() => {
    resultHandledRef.current = false;
    resetGame();
  }, [resetGame]);

  // Запуск хода AI
  useEffect(() => {
    if (currentPlayer === "O" && !gameOver) {
      makeAIMove();
    }
  }, [currentPlayer, gameOver, makeAIMove]);

  // Обработка результата
  useEffect(() => {
    if (gameOver) {
      handleGameResult();
    }
  }, [gameOver, handleGameResult]);

  return {
    resetGame: handleResetGame,
  };
}
